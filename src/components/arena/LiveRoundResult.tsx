// src/components/arena/LiveRoundResult.tsx
"use client";

import { CheckCircle, XCircle, ChevronRight, Zap } from "lucide-react";
import type { LiveRoomPlayer, LiveRoomQuestion } from "@/types/liveRoom";

interface Props {
  players: LiveRoomPlayer[];
  currentQuestion: LiveRoomQuestion;
  isHost: boolean;
  onNext: () => void;
  isLastRound: boolean;
}

export default function LiveRoundResult({
  players,
  currentQuestion,
  isHost,
  onNext,
  isLastRound,
}: Props) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="rr-root">
      <div className="rr-banner rr-banner--correct">
        <CheckCircle size={20} />
        Round over — scores updated!
      </div>

      {/* Correct answer reveal */}
      <div className="glass-card" style={{ width: "100%", padding: "1rem 1.25rem" }}>
        <p className="waiting-section-label" style={{ marginBottom: "0.4rem" }}>
          Correct Answer
        </p>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.1rem",
          fontWeight: 900,
          color: "var(--color-cyan-neon)",
          letterSpacing: "0.05em",
        }}>
          {currentQuestion.options.find(
            (o) => o.id === currentQuestion.correct_option_id
          )?.label ?? "—"}
        </p>
      </div>

      {/* Live leaderboard */}
      <div className="glass-card rr-standings" style={{ width: "100%" }}>
        <p className="waiting-section-label" style={{ marginBottom: "0.75rem" }}>
          Live Standings
        </p>
        <ol className="rr-standings-list">
          {sorted.map((p, i) => (
            <li
              key={p.id}
              className="rr-standing-row"
              style={{
                background: i === 0 ? "rgba(255,215,0,0.04)" : "transparent",
              }}
            >
              <span
                className="rr-standing-rank"
                style={{
                  color: i === 0
                    ? "var(--color-war-gold)"
                    : i === 1
                    ? "#C0C0C0"
                    : i === 2
                    ? "#CD7F32"
                    : "rgba(255,255,255,0.25)",
                }}
              >
                {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
              </span>
              <span className="rr-standing-handle">
                {p.avatar_emoji} {p.handle}
              </span>
              {p.streak > 1 && (
                <span className="rr-streak-badge">
                  <Zap size={10} /> {p.streak}x
                </span>
              )}
              <span className="rr-standing-score">
                {p.score.toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Only host can advance */}
      {isHost ? (
        <button
          className="btn-neon-cyan"
          style={{ width: "100%", maxWidth: "360px" }}
          onClick={onNext}
        >
          {isLastRound ? "See Final Results" : "Next Round"}
          <ChevronRight size={14} />
        </button>
      ) : (
        <p className="waiting-fee-notice">
          Waiting for host to continue…
        </p>
      )}
    </div>
  );
}