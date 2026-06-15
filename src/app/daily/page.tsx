// src/app/daily/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Zap, Lightbulb, Trophy, Coins } from "lucide-react";
import { getTodaysPuzzle } from "@/data/puzzles";
import { usePuzzleGame } from "@/hooks/usePuzzleGame";
import RebusRenderer from "@/components/puzzle/RebusRenderer";
import AnswerInput from "@/components/puzzle/AnswerInput";
import GameResult from "@/components/puzzle/GameResult";
import CountdownTimer from "@/components/puzzle/CountdownTimer";

export default function DailyPage() {
  const puzzle = getTodaysPuzzle();
  const { state, start, setInput, submitAnswer, useHint, giveUp } = usePuzzleGame(puzzle);
  const [lastWasWrong, setLastWasWrong] = useState(false);

  // Auto-start on mount
  useEffect(() => { start(); }, [start]);

  function handleSubmit() {
    const prevAttempts = state.attempts;
    submitAnswer();
    // If attempts increased but status is still playing → was wrong
    setTimeout(() => {
      setLastWasWrong(
        state.status === "playing" && state.attempts > prevAttempts
      );
    }, 0);
  }

  function handleHint(tileId: string) {
    useHint(tileId);
  }

  const isOver = state.status === "correct"
    || state.status === "failed"
    || state.status === "revealed";

  const currentReward = Math.max(
    0,
    puzzle.baseReward - state.hintsUsed.length * puzzle.hintCostPerTile
  );

  return (
    <div className="page-container">

      {/* ── Header ── */}
      <section className="page-header">
        <div className="page-eyebrow">
          <Zap size={12} />
          <span>Daily Clue</span>
        </div>
        <h1 className="page-title">
          Today's <span className="text-neon-cyan">Puzzle</span>
        </h1>
        <p className="page-subtitle">
          Decode the rebus. Be the first. Earn $WAR.
        </p>
      </section>

      <div className="divider-cyber" style={{ maxWidth: "480px", margin: "0 auto" }} />

      {/* ── Puzzle canvas ── */}
      {!isOver ? (
        <>
          <section className="daily-puzzle-area">
            <div className="glass-card-cyan daily-puzzle-canvas">
              <div className="puzzle-category-badge">{puzzle.category}</div>
              <RebusRenderer
                segments={puzzle.segments}
                revealedTiles={state.hintsUsed}
                onHint={handleHint}
                disabled={isOver}
              />
            </div>

            {/* Meta row */}
            <div className="daily-meta-row">
              <CountdownTimer />
              <div className="daily-meta-chip">
                <Trophy size={13} />
                <span>
                  Reward:{" "}
                  <strong style={{ color: "var(--color-war-gold)" }}>
                    {currentReward.toLocaleString()} $WAR
                  </strong>
                </span>
              </div>
              <div className="daily-meta-chip">
                <Lightbulb size={13} />
                <span>
                  Hints cost{" "}
                  <strong>{puzzle.hintCostPerTile} $WAR</strong> each
                </span>
              </div>
            </div>
          </section>

          {/* ── Answer input ── */}
          <section className="daily-answer-section">
            <AnswerInput
              value={state.input}
              onChange={setInput}
              onSubmit={handleSubmit}
              attempts={state.attempts}
              maxAttempts={state.maxAttempts}
              disabled={isOver}
              lastWasWrong={lastWasWrong}
            />
            <div className="daily-give-up-row">
              <button className="give-up-btn" onClick={giveUp}>
                Reveal answer
              </button>
            </div>
          </section>
        </>
      ) : (
        /* ── Result screen ── */
        <GameResult state={state} onReset={start} />
      )}

    </div>
  );
}