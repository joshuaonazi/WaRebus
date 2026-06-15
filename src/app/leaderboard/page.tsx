// src/app/leaderboard/page.tsx
import { Trophy, TrendingUp, Zap } from "lucide-react";

const MOCK_LEADERS = [
  { rank: 1,  handle: "0xSatoshi",    war: "142,800", streak: 21, delta: "+2" },
  { rank: 2,  handle: "CipherWitch",  war: "98,440",  streak: 14, delta: "+1" },
  { rank: 3,  handle: "RebusKing",    war: "87,200",  streak: 9,  delta: "—"  },
  { rank: 4,  handle: "DgenPrince",   war: "61,500",  streak: 7,  delta: "-1" },
  { rank: 5,  handle: "NakamotoJr",   war: "54,900",  streak: 5,  delta: "+3" },
  { rank: 6,  handle: "GlitchNode",   war: "43,200",  streak: 3,  delta: "—"  },
  { rank: 7,  handle: "VoidTrader",   war: "38,750",  streak: 2,  delta: "-2" },
  { rank: 8,  handle: "MemPoolMage",  war: "29,100",  streak: 1,  delta: "—"  },
] as const;

const RANK_COLORS: Record<number, string> = {
  1: "var(--color-war-gold)",
  2: "#C0C0C0",
  3: "#CD7F32",
};

export default function LeaderboardPage() {
  return (
    <div className="page-container">

      {/* ── Header ── */}
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

      {/* ── Table ── */}
      <section className="lb-section">
        <div className="glass-card lb-table-wrap">

          {/* Table header */}
          <div className="lb-row lb-row--header">
            <span className="lb-col-rank">#</span>
            <span className="lb-col-player">Player</span>
            <span className="lb-col-streak">
              <Zap size={11} /> Streak
            </span>
            <span className="lb-col-delta">24h</span>
            <span className="lb-col-war">$WAR</span>
          </div>

          <div className="divider-cyber" />

          {/* Rows */}
          {MOCK_LEADERS.map((entry) => (
            <div
              key={entry.rank}
              className={`lb-row lb-row--entry ${entry.rank <= 3 ? "lb-row--podium" : ""}`}
            >
              <span
                className="lb-col-rank lb-rank-num"
                style={{ color: RANK_COLORS[entry.rank] ?? "rgba(255,255,255,0.3)" }}
              >
                {entry.rank <= 3
                  ? ["🥇","🥈","🥉"][entry.rank - 1]
                  : entry.rank}
              </span>

              <span className="lb-col-player lb-handle">
                {entry.handle}
              </span>

              <span className="lb-col-streak lb-streak">
                <Zap size={11} style={{ color: "var(--color-cyan-neon)" }} />
                {entry.streak}d
              </span>

              <span
                className="lb-col-delta lb-delta"
                style={{
                  color: entry.delta.startsWith("+")
                    ? "var(--color-cyan-neon)"
                    : entry.delta.startsWith("-")
                    ? "var(--color-magenta-neon)"
                    : "rgba(255,255,255,0.25)",
                }}
              >
                {entry.delta}
              </span>

              <span className="lb-col-war lb-war-amount">
                {entry.war}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}