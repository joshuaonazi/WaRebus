// src/hooks/usePuzzleGame.ts
"use client";

import { useState, useCallback } from "react";
import type {
  Puzzle,
  PuzzleGameState,
  GameStatus,
  HintResult,
} from "@/types/puzzle";

const MAX_ATTEMPTS = 5;

function normalise(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

function calcReward(puzzle: Puzzle, hintsUsed: string[]): number {
  const deducted = hintsUsed.length * puzzle.hintCostPerTile;
  return Math.max(0, puzzle.baseReward - deducted);
}

function makeInitialState(puzzle: Puzzle): PuzzleGameState {
  return {
    puzzle,
    status: "idle",
    input: "",
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    hintsUsed: [],
    warEarned: 0,
    startedAt: 0, // ← 0 avoids SSR/client mismatch
  };
}

export function usePuzzleGame(puzzle: Puzzle) {
  const [state, setState] = useState<PuzzleGameState>(() =>
    makeInitialState(puzzle)
  );

  // ── Start / reset ──────────────────────────────────────────
  const start = useCallback(() => {
    setState({
      ...makeInitialState(puzzle),
      status: "playing",
      startedAt: Date.now(), // ← only set on client, inside a callback
    });
  }, [puzzle]);

  // ── Input change ───────────────────────────────────────────
  const setInput = useCallback((value: string) => {
    setState((prev) =>
      prev.status === "playing" ? { ...prev, input: value } : prev
    );
  }, []);

  // ── Submit answer ──────────────────────────────────────────
  const submitAnswer = useCallback((): GameStatus => {
    let nextStatus: GameStatus = "playing";

    setState((prev) => {
      if (prev.status !== "playing") return prev;

      const guess = normalise(prev.input);
      const correct =
        guess === normalise(prev.puzzle.answer) ||
        (prev.puzzle.alternateAnswers ?? []).some(
          (alt) => guess === normalise(alt)
        );

      if (correct) {
        const earned = calcReward(prev.puzzle, prev.hintsUsed);
        nextStatus = "correct";
        return {
          ...prev,
          status: "correct",
          warEarned: earned,
          solvedAt: Date.now(),
        };
      }

      const newAttempts = prev.attempts + 1;
      const failed = newAttempts >= prev.maxAttempts;
      nextStatus = failed ? "failed" : "playing";

      return {
        ...prev,
        attempts: newAttempts,
        input: "",
        status: nextStatus,
      };
    });

    return nextStatus;
  }, []);

  // ── Use a hint ─────────────────────────────────────────────
  const useHint = useCallback((tileId: string): HintResult | null => {
    let result: HintResult | null = null;

    setState((prev) => {
      if (prev.status !== "playing") return prev;
      if (prev.hintsUsed.includes(tileId)) return prev;

      const tile = prev.puzzle.segments
        .map((s) => s.tile)
        .find((t) => t.id === tileId);

      if (!tile) return prev;

      const cost = tile.hintCost ?? prev.puzzle.hintCostPerTile;
      const newHintsUsed = [...prev.hintsUsed, tileId];
      const remainingReward = calcReward(prev.puzzle, newHintsUsed);

      result = {
        tileId,
        value: tile.value,
        costDeducted: cost,
        remainingReward,
      };

      return { ...prev, hintsUsed: newHintsUsed };
    });

    return result;
  }, []);

  // ── Give up ────────────────────────────────────────────────
  const giveUp = useCallback(() => {
    setState((prev) =>
      prev.status === "playing" ? { ...prev, status: "revealed" } : prev
    );
  }, []);

  return { state, start, setInput, submitAnswer, useHint, giveUp };
}