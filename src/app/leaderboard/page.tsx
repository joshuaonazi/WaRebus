// src/app/leaderboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Trophy, TrendingUp, Zap, Loader2 } from "lucide-react";
import { fetchLeaderboard } from "@/lib/war";

type LeaderEntry = {
  id: string;
  handle: string;
  avatar_emoji: string;
  war_balance: number;
  streak: number;
  total_solved: number;
};

const RANK_COLORS: Record<number, string> = {
  1: "var(--color-war-gold)",
  2: "#C0C0C0",
  3: "#CD7F32",
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard(20).then((data) => {
      setLeaders(data as LeaderEntry[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="page-container">

      <section className="page-header">
        <div className="page-eyebrow">
          <Trophy size={12} />
          <span>Leaderboard</span>
        </div>
        <h1 className="page-title">
          Top <span className="text-neon-gold">Solvers</span>
        </h1>
        <p className="page-subtitle">
          Daily rankings reset at midnight UTC. Streaks multiply your $WAR.
        </p>
      </section>

      <div className="divider-cyber" style={{ maxWidth: "480px", margin: "0 auto" }} />

      <section className="lb-section">
        <div className="glass-card lb-table-wrap">

          <div className="lb-row lb-row--header">
            <span className="lb-col-rank">#</span>
            <span className="lb-col-player">Player</span>
            <span className="lb-col-streak">
              <Zap size={11} /> Streak
            </span>
            <span className="lb-col-delta">
              <TrendingUp size={11} /> Solved
            </span>
            <span className="lb-col-war">$WAR</span>
          </div>

          <div className="divider-cyber" />

          {loading ? (
            <div className="lb-loading">
              <Loader2 size={20} className="auth-spinner" />
              <span>Loading rankings…</span>
            </div>
          ) : leaders.length === 0 ? (
            <div className="lb-loading">
              <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                No players yet. Be the first to solve a puzzle!
              </p>
            </div>
          ) : (
            leaders.map((entry, i) => (
              <div
                key={entry.id}
                className={`lb-row lb-row--entry ${i < 3 ? "lb-row--podium" : ""}`}
              >
                <span
                  className="lb-col-rank lb-rank-num"
                  style={{ color: RANK_COLORS[i + 1] ?? "rgba(255,255,255,0.3)" }}
                >
                  {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                </span>

                <span className="lb-col-player lb-handle">
                  {entry.avatar_emoji} {entry.handle}
                </span>

                <span className="lb-col-streak lb-streak">
                  <Zap size={11} style={{ color: "var(--color-cyan-neon)" }} />
                  {entry.streak}d
                </span>

                <span className="lb-col-delta" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", textAlign: "center" }}>
                  {entry.total_solved}
                </span>

                <span className="lb-war-amount">
                  {entry.war_balance.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}