// src/components/arena/LiveFinalResult.tsx
"use client";

import { Trophy, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import type { LiveRoom, LiveRoomPlayer } from "@/types/liveRoom";

interface Props {
  room: LiveRoom;
  players: LiveRoomPlayer[];
}

export default function LiveFinalResult({ room, players }: Props) {
  const router = useRouter();
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="fr-root">
      <div className="page-eyebrow" style={{ marginBottom: "0.5rem" }}>
        <Trophy size={12} />
        <span>Match Over</span>
      </div>

      <h2 className="fr-winner-heading">
        <span style={{ color: "var(--color-war-gold)" }}>
          {winner?.avatar_emoji} {winner?.handle}
        </span>{" "}
        wins the pot!
      </h2>

      <div className="fr-pot-display">
        <Coins size={18} style={{ color: "var(--color-war-gold)" }} />
        <span className="fr-pot-amount">{room.pot_total.toLocaleString()}</span>
        <span className="fr-pot-label">$WAR</span>
      </div>

      {/* Podium */}
      <div className="fr-podium">
        {podium.map((p, i) => (
          <div
            key={p.id}
            className={`fr-podium-card ${i === 0 ? "fr-podium-card--first" : ""}`}
          >
            <span className="fr-podium-medal">
              {["🥇", "🥈", "🥉"][i]}
            </span>
            <span className="fr-podium-avatar">{p.avatar_emoji}</span>
            <span className="fr-podium-handle">{p.handle}</span>
            <span className="fr-podium-score">
              {p.score.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {rest.length > 0 && (
        <div className="glass-card fr-rest-list">
          {rest.map((p, i) => (
            <div key={p.id} className="rr-standing-row">
              <span className="rr-standing-rank">{i + 4}</span>
              <span className="rr-standing-handle">
                {p.avatar_emoji} {p.handle}
              </span>
              <span className="rr-standing-score">
                {p.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        className="btn-ghost-cyan"
        style={{ marginTop: "0.5rem" }}
        onClick={() => router.push("/arena")}
      >
        Back to Arena
      </button>
    </div>
  );
}