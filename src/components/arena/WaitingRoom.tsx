// src/components/arena/WaitingRoom.tsx
"use client";

import { Users, Coins, Crown, Wifi, Play } from "lucide-react";
import type { ArenaRoom } from "@/types/arena";

interface Props {
  room: ArenaRoom;
  onStart: () => void;
}

export default function WaitingRoom({ room, onStart }: Props) {
  const readyCount = room.players.filter((p) => p.status === "ready").length;
  const canStart = room.players.length >= 2;

  return (
    <div className="waiting-root">

      {/* Room header */}
      <div className="waiting-header">
        <div className="page-eyebrow">
          <Wifi size={12} />
          <span>Room: {room.id.toUpperCase()}</span>
        </div>
        <h2 className="waiting-room-name">{room.name}</h2>
        <div className="waiting-meta-row">
          <span className="waiting-meta-chip">
            <Users size={12} />
            {room.players.length}/{room.maxPlayers} players
          </span>
          <span className="waiting-meta-chip">
            <Coins size={12} />
            Pot: <strong style={{ color: "var(--color-war-gold)" }}>
              {room.potTotal.toLocaleString()} $WAR
            </strong>
          </span>
          <span className="waiting-meta-chip">
            {room.totalRounds} rounds
          </span>
        </div>
      </div>

      <div className="divider-cyber" style={{ width: "100%" }} />

      {/* Player list */}
      <div className="waiting-players">
        <p className="waiting-section-label">
          Players — {readyCount}/{room.players.length} ready
        </p>
        <ul className="waiting-player-list">
          {room.players.map((player) => (
            <li key={player.id} className="waiting-player-row">
              <div className="waiting-player-left">
                <span className="waiting-player-avatar">{player.avatarEmoji}</span>
                <div>
                  <p className="waiting-player-handle">
                    {player.handle}
                    {player.isYou && (
                      <span className="waiting-you-badge">YOU</span>
                    )}
                  </p>
                  {player.isHost && (
                    <p className="waiting-host-label">
                      <Crown size={10} /> Host
                    </p>
                  )}
                </div>
              </div>
              <span className={`waiting-ready-badge ${
                player.status === "ready"
                  ? "waiting-ready-badge--ready"
                  : "waiting-ready-badge--waiting"
              }`}>
                {player.status === "ready" ? "READY" : "WAITING"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Entry fee notice */}
      <div className="waiting-fee-notice">
        <Coins size={13} style={{ color: "var(--color-war-gold)" }} />
        <span>
          Entry fee: <strong style={{ color: "var(--color-war-gold)" }}>
            {room.entryFee} $WAR
          </strong> per player · Winner takes the pot
        </span>
      </div>

      {/* Start button */}
      <button
        className={canStart ? "btn-neon-cyan" : "btn-ghost-cyan"}
        style={{ width: "100%", maxWidth: "360px" }}
        onClick={onStart}
        disabled={!canStart}
      >
        <Play size={14} />
        {canStart ? "Start Match" : "Waiting for players…"}
      </button>
    </div>
  );
}