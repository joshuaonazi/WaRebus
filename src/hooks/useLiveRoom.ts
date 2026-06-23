// src/hooks/useLiveRoom.ts
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  getRoomById,
  getRoomPlayers,
  getRoomQuestions,
  updateRoomStatus,
  submitAnswer as submitAnswerLib,
} from "@/lib/liveRoom";
import type { LiveRoom, LiveRoomPlayer, LiveRoomQuestion } from "@/types/liveRoom";

export interface LiveRoomState {
  room: LiveRoom | null;
  players: LiveRoomPlayer[];
  questions: LiveRoomQuestion[];
  currentQuestion: LiveRoomQuestion | null;
  myPlayer: LiveRoomPlayer | null;
  timeRemaining: number;
  selectedOptionId: string | null;
  countdownValue: number;
  loading: boolean;
}

export function useLiveRoom(roomId: string, userId: string) {
  const [state, setState] = useState<LiveRoomState>({
    room: null,
    players: [],
    questions: [],
    currentQuestion: null,
    myPlayer: null,
    timeRemaining: 0,
    selectedOptionId: null,
    countdownValue: 3,
    loading: true,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef<number>(0);

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // ── Initial load ───────────────────────────────────────────
  useEffect(() => {
    if (!roomId || !userId) return;

    async function load() {
      const [room, players, questions] = await Promise.all([
        getRoomById(roomId),
        getRoomPlayers(roomId),
        getRoomQuestions(roomId),
      ]);

      const myPlayer = players.find((p) => p.user_id === userId) ?? null;
      const currentQuestion = room?.current_question_id
        ? questions.find((q) => q.id === room.current_question_id) ?? null
        : null;

      setState((prev) => ({
        ...prev,
        room,
        players,
        questions,
        myPlayer,
        currentQuestion,
        loading: false,
      }));
    }

    load();
  }, [roomId, userId]);

  // ── Realtime subscriptions ─────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured || !roomId) return;

    // Subscribe to room status changes
    const roomSub = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "live_rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const updatedRoom = payload.new as LiveRoom;
          setState((prev) => {
            const currentQuestion = updatedRoom.current_question_id
              ? prev.questions.find(
                  (q) => q.id === updatedRoom.current_question_id
                ) ?? null
              : null;

            // Handle countdown phase
            if (updatedRoom.status === "countdown") {
              startCountdown(updatedRoom, prev.questions);
            }

            // Handle question phase
            if (
              updatedRoom.status === "question" &&
              prev.room?.status !== "question"
            ) {
              questionStartRef.current = Date.now();
              startQuestionTimer(currentQuestion?.time_limit ?? 20);
            }

            // Handle non-question phases — clear timer
            if (
              updatedRoom.status !== "question" &&
              updatedRoom.status !== "countdown"
            ) {
              clearTimer();
            }

            return {
              ...prev,
              room: updatedRoom,
              currentQuestion,
              selectedOptionId:
                updatedRoom.status === "question" ? null : prev.selectedOptionId,
            };
          });
        }
      )
      .subscribe();

    // Subscribe to player score changes
    const playersSub = supabase
      .channel(`players:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_room_players",
          filter: `room_id=eq.${roomId}`,
        },
        async () => {
          // Re-fetch all players on any change for simplicity
          const players = await getRoomPlayers(roomId);
          setState((prev) => ({
            ...prev,
            players,
            myPlayer: players.find((p) => p.user_id === userId) ?? prev.myPlayer,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomSub);
      supabase.removeChannel(playersSub);
      clearTimer();
    };
  }, [roomId, userId]);

  // ── Countdown timer ────────────────────────────────────────
  function startCountdown(room: LiveRoom, questions: LiveRoomQuestion[]) {
    clearTimer();
    let count = 3;
    setState((prev) => ({ ...prev, countdownValue: count }));

    timerRef.current = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearTimer();
        return;
      }
      setState((prev) => ({ ...prev, countdownValue: count }));
    }, 1000);
  }

  // ── Question timer ─────────────────────────────────────────
  function startQuestionTimer(timeLimit: number) {
    clearTimer();
    let remaining = timeLimit;
    setState((prev) => ({ ...prev, timeRemaining: remaining }));

    timerRef.current = setInterval(() => {
      remaining -= 1;
      setState((prev) => ({ ...prev, timeRemaining: remaining }));
      if (remaining <= 0) clearTimer();
    }, 1000);
  }

  // ── Host: start game ───────────────────────────────────────
  const hostStartGame = useCallback(async () => {
    if (!state.room) return;
    await updateRoomStatus(state.room.id, { status: "countdown" });

    // After 3s, push first question
    setTimeout(async () => {
      const firstQ = state.questions[0];
      if (!firstQ || !state.room) return;
      await updateRoomStatus(state.room.id, {
        status: "question",
        current_round: 1,
        current_question_id: firstQ.id,
        question_started_at: new Date().toISOString(),
      });
    }, 3000);
  }, [state.room, state.questions]);

  // ── Host: advance to next round ────────────────────────────
  const hostNextRound = useCallback(async () => {
    if (!state.room) return;
    const nextRound = state.room.current_round + 1;
    const nextQ = state.questions[nextRound - 1];

    if (!nextQ) {
      // Game over
      const sorted = [...state.players].sort((a, b) => b.score - a.score);
      await updateRoomStatus(state.room.id, {
        status: "finished",
        winner_id: sorted[0]?.user_id ?? null,
      });
      return;
    }

    // Show round result briefly then next question
    await updateRoomStatus(state.room.id, { status: "round_result" });

    setTimeout(async () => {
      if (!state.room) return;
      await updateRoomStatus(state.room.id, {
        status: "countdown",
        current_round: nextRound,
        current_question_id: nextQ.id,
        question_started_at: null,
      });

      setTimeout(async () => {
        if (!state.room) return;
        await updateRoomStatus(state.room.id, {
          status: "question",
          question_started_at: new Date().toISOString(),
        });
      }, 3000);
    }, 5000);
  }, [state.room, state.questions, state.players]);

  // ── Player: submit answer ──────────────────────────────────
  const playerSubmitAnswer = useCallback(
    async (optionId: string) => {
      if (
        !state.myPlayer ||
        !state.currentQuestion ||
        state.selectedOptionId
      )
        return;

      setState((prev) => ({ ...prev, selectedOptionId: optionId }));
      clearTimer();

      const answeredAtMs = Date.now() - questionStartRef.current;

      await submitAnswerLib({
        roomId,
        questionId: state.currentQuestion.id,
        playerId: state.myPlayer.id,
        optionId,
        correctOptionId: state.currentQuestion.correct_option_id,
        timeLimit: state.currentQuestion.time_limit,
        reward: state.currentQuestion.reward,
        answeredAtMs,
      });
    },
    [state.myPlayer, state.currentQuestion, state.selectedOptionId, roomId]
  );

  return {
    state,
    hostStartGame,
    hostNextRound,
    playerSubmitAnswer,
  };
}