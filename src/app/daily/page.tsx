// src/app/daily/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Zap, Lightbulb, Trophy } from "lucide-react";
import { getTodaysPuzzle } from "@/data/puzzles";
import { usePuzzleGame } from "@/hooks/usePuzzleGame";
import { useAuth } from "@/context/AuthContext";
import { saveDailyAttempt, updateStreak, getTodaysAttempt } from "@/lib/war";
import RebusRenderer from "@/components/puzzle/RebusRenderer";
import AnswerInput from "@/components/puzzle/AnswerInput";
import GameResult from "@/components/puzzle/GameResult";
import CountdownTimer from "@/components/puzzle/CountdownTimer";

export default function DailyPage() {
  const puzzle = getTodaysPuzzle();
  const { user, refreshProfile } = useAuth();
  const { state, start, setInput, submitAnswer, useHint, giveUp } =
    usePuzzleGame(puzzle);
  const [lastWasWrong, setLastWasWrong] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const savedRef = useRef(false);

  // Auto-start
  useEffect(() => {
    start();
  }, [start]);

  // Check if user already played today
  useEffect(() => {
    if (!user) return;
    getTodaysAttempt(user.id, puzzle.id).then((attempt) => {
      if (attempt?.solved) setAlreadyPlayed(true);
    });
  }, [user, puzzle.id]);

  // Save result when game ends
  useEffect(() => {
    if (savedRef.current) return;
    if (!user) return;
    if (state.status !== "correct" && state.status !== "failed") return;

    savedRef.current = true;

    const solveTime =
      state.solvedAt && state.startedAt
        ? Math.round((state.solvedAt - state.startedAt) / 1000)
        : null;

    saveDailyAttempt({
      userId: user.id,
      puzzleId: puzzle.id,
      solved: state.status === "correct",
      attempts: state.attempts,
      hintsUsed: state.hintsUsed.length,
      warEarned: state.status === "correct" ? state.warEarned : 0,
      solveTimeSeconds: solveTime,
    }).then(() => {
      if (state.status === "correct") {
        updateStreak(user.id);
        refreshProfile(); // update navbar $WAR balance
      }
    });
  }, [state.status, user, puzzle.id, state, refreshProfile]);

  function handleSubmit() {
    const prevAttempts = state.attempts;
    submitAnswer();
    setTimeout(() => {
      setLastWasWrong(
        state.status === "playing" && state.attempts > prevAttempts
      );
    }, 0);
  }

  const isOver =
    state.status === "correct" ||
    state.status === "failed" ||
    state.status === "revealed";

  const currentReward = Math.max(
    0,
    puzzle.baseReward - state.hintsUsed.length * puzzle.hintCostPerTile
  );

  return (
    <div className="page-container">

      {/* Header */}
      <section className="page-header">
        <div className="page-eyebrow">
          <Zap size={12} />
          <span>Daily Clue</span>
        </div>
        <h1 className="page-title">
          Today's <span className="text-neon-cyan">Puzzle</span>
        </h1>
        <p className="page-subtitle">
          {alreadyPlayed
            ? "You've already solved today's puzzle. Come back tomorrow!"
            : "Decode the rebus. Be the first. Earn $WAR."}
        </p>
      </section>

      <div className="divider-cyber" style={{ maxWidth: "480px", margin: "0 auto" }} />

      {alreadyPlayed ? (
        <div className="glass-card-cyan daily-puzzle-canvas" style={{ padding: "2.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "2rem" }}>✅</p>
          <p className="page-subtitle" style={{ marginTop: "0.5rem" }}>
            Puzzle complete! Your $WAR has been credited.
          </p>
        </div>
      ) : !isOver ? (
        <>
          <section className="daily-puzzle-area">
            <div className="glass-card-cyan daily-puzzle-canvas">
              <div className="puzzle-category-badge">{puzzle.category}</div>
              <RebusRenderer
                segments={puzzle.segments}
                revealedTiles={state.hintsUsed}
                onHint={(id) => useHint(id)}
                disabled={isOver}
              />
            </div>

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
                  Hints cost <strong>{puzzle.hintCostPerTile} $WAR</strong> each
                </span>
              </div>
            </div>
          </section>

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
              {!user && (
                <p className="daily-guest-notice">
                  Sign in to save your progress and earn $WAR
                </p>
              )}
              <button className="give-up-btn" onClick={giveUp}>
                Reveal answer
              </button>
            </div>
          </section>
        </>
      ) : (
        <GameResult state={state} onReset={start} />
      )}

    </div>
  );
}