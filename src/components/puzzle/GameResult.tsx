// src/components/puzzle/GameResult.tsx
"use client";

import { Trophy, XCircle, RefreshCw, Coins } from "lucide-react";
import type { PuzzleGameState } from "@/types/puzzle";

interface Props {
  state: PuzzleGameState;
  onReset: () => void;
}

export default function GameResult({ state, onReset }: Props) {
  const won = state.status === "correct";
  const timeTaken = state.solvedAt
    ? Math.round((state.solvedAt - state.startedAt) / 1000)
    : null;

  return (
    <div className={`result-card ${won ? "result-card--won" : "result-card--lost"}`}>
      {/* Icon */}
      <div className="result-icon">
        {won
          ? <Trophy size={36} style={{ color: "var(--color-war-gold)" }} />
          : <XCircle size={36} style={{ color: "var(--color-magenta-neon)" }} />
        }
      </div>

      {/* Heading */}
      <h2 className="result-heading">
        {won ? "Puzzle Solved!" : "Better luck tomorrow"}
      </h2>

      {/* Answer reveal */}
      <p className="result-answer">
        <span className="result-answer-label">Answer: </span>
        <span className="result-answer-value">
          {state.puzzle.answer.toUpperCase()}
        </span>
      </p>

      {/* Explanation */}
      <p className="result-explanation">{state.puzzle.explanation}</p>

      {/* Stats row */}
      <div className="result-stats">
        {won && (
          <div className="result-stat">
            <Coins size={14} style={{ color: "var(--color-war-gold)" }} />
            <span className="result-stat-value" style={{ color: "var(--color-war-gold)" }}>
              +{state.warEarned.toLocaleString()}
            </span>
            <span className="result-stat-label">$WAR earned</span>
          </div>
        )}
        {timeTaken !== null && (
          <div className="result-stat">
            <span className="result-stat-value">{timeTaken}s</span>
            <span className="result-stat-label">solve time</span>
          </div>
        )}
        <div className="result-stat">
          <span className="result-stat-value">{state.attempts}</span>
          <span className="result-stat-label">attempt{state.attempts !== 1 ? "s" : ""}</span>
        </div>
        <div className="result-stat">
          <span className="result-stat-value">{state.hintsUsed.length}</span>
          <span className="result-stat-label">hint{state.hintsUsed.length !== 1 ? "s" : ""} used</span>
        </div>
      </div>

      {/* Actions */}
      <div className="result-actions">
        <button className="btn-ghost-cyan" onClick={onReset}>
          <RefreshCw size={14} />
          Play Again
        </button>
      </div>
    </div>
  );
}