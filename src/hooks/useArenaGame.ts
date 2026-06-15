// src/hooks/useArenaGame.ts
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ArenaRoom, LiveQuestion, PlayerAnswer, RoundResult } from "@/types/arena";

export type ArenaPhase =
  | "lobby"
  | "countdown"   // 3-2-1 before question
  | "question"    // answering
  | "round-result"
  | "final-result";

interface ArenaGameState {
  room: ArenaRoom;
  phase: ArenaPhase;
  currentQuestion: LiveQuestion | null;
  currentQuestionIndex: number;
  timeRemaining: number;
  selectedOptionId: string | null;
  lastRoundResult: RoundResult | null;
  countdownValue: number; // 3, 2, 1
}

export function useArenaGame(
  initialRoom: ArenaRoom,
  questions: LiveQuestion[]
) {
  const [state, setState] = useState<ArenaGameState>({
    room: initialRoom,
    phase: "lobby",
    currentQuestion: null,
    currentQuestionIndex: 0,
    timeRemaining: 0,
    selectedOptionId: null,
    lastRoundResult: null,
    countdownValue: 3,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // ── Start game (host action) ───────────────────────────────
  const startGame = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "countdown", countdownValue: 3 }));
  }, []);

  // ── Countdown 3-2-1 then show question ────────────────────
  useEffect(() => {
    if (state.phase !== "countdown") return;
    clearTimer();

    if (state.countdownValue > 0) {
      timerRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.countdownValue <= 1) {
            clearTimer();
            const q = questions[prev.currentQuestionIndex] ?? null;
            return {
              ...prev,
              phase: "question",
              currentQuestion: q,
              timeRemaining: q?.timeLimit ?? 20,
              selectedOptionId: null,
              countdownValue: 0,
            };
          }
          return { ...prev, countdownValue: prev.countdownValue - 1 };
        });
      }, 1000);
    }

    return clearTimer;
  }, [state.phase, state.countdownValue, questions, state.currentQuestionIndex]);

  // ── Question timer countdown ───────────────────────────────
  useEffect(() => {
    if (state.phase !== "question") return;
    clearTimer();

    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemaining <= 1) {
          clearTimer();
          return buildRoundResult(prev, null); // time out
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return clearTimer;
  }, [state.phase, state.currentQuestion]);

  // ── Select answer ──────────────────────────────────────────
  const selectAnswer = useCallback((optionId: string) => {
    setState((prev) => {
      if (prev.phase !== "question" || prev.selectedOptionId) return prev;
      clearTimer();
      return buildRoundResult(prev, optionId);
    });
  }, []);

  // ── Next round ─────────────────────────────────────────────
  const nextRound = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;
      if (nextIndex >= questions.length) {
        return { ...prev, phase: "final-result" };
      }
      return {
        ...prev,
        phase: "countdown",
        currentQuestionIndex: nextIndex,
        countdownValue: 3,
        selectedOptionId: null,
        lastRoundResult: null,
      };
    });
  }, [questions.length]);

  // ── Reset ──────────────────────────────────────────────────
  const resetGame = useCallback(() => {
    clearTimer();
    setState({
      room: initialRoom,
      phase: "lobby",
      currentQuestion: null,
      currentQuestionIndex: 0,
      timeRemaining: 0,
      selectedOptionId: null,
      lastRoundResult: null,
      countdownValue: 3,
    });
  }, [initialRoom]);

  return { state, startGame, selectAnswer, nextRound, resetGame };
}

// ── Helper: build round result state ──────────────────────────
function buildRoundResult(
  prev: ArenaGameState,
  selectedOptionId: string | null
): ArenaGameState {
  const q = prev.currentQuestion!;
  const correct = selectedOptionId === q.correctOptionId;
  const timeBonus = correct
    ? Math.floor((prev.timeRemaining / q.timeLimit) * 100)
    : 0;
  const points = correct ? q.reward + timeBonus : 0;

  const updatedPlayers = prev.room.players.map((p) => {
    if (!p.isYou) {
      // Simulate other players
      const otherCorrect = Math.random() > 0.4;
      return {
        ...p,
        score: p.score + (otherCorrect ? q.reward : 0),
        streak: otherCorrect ? p.streak + 1 : 0,
      };
    }
    return {
      ...p,
      score: p.score + points,
      streak: correct ? p.streak + 1 : 0,
    };
  });

  const standings = [...updatedPlayers]
    .sort((a, b) => b.score - a.score)
    .map(({ id, handle, score, streak }) => ({ id, handle, score, streak }));

  const answer: PlayerAnswer = {
    playerId: "you",
    optionId: selectedOptionId ?? "",
    answeredAt: (q.timeLimit - prev.timeRemaining) * 1000,
    correct,
    pointsEarned: points,
  };

  return {
    ...prev,
    phase: "round-result",
    selectedOptionId,
    room: { ...prev.room, players: updatedPlayers },
    lastRoundResult: {
      questionId: q.id,
      correctOptionId: q.correctOptionId,
      playerAnswers: [answer],
      standings,
    },
  };
}