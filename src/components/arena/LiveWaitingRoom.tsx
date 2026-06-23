// src/components/arena/LiveWaitingRoom.tsx
"use client";

import { Users, Coins, Crown, Wifi, Play, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { LiveRoom, LiveRoomPlayer } from "@/types/liveRoom";
import RoomCodeDisplay from "./RoomCodeDisplay";

interface Props {
  room: LiveRoom;
  players: LiveRoomPlayer[];
  isHost: boolean;
  onStart: () => void;
}

export default function LiveWaitingRoom({ room, players, isHost, onStart }: Props) {
  const joinUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/arena/join?code=${room.code}`;
  const canStart = players.length >= 1;

  return (
    <div className="waiting-root">
      <div className="waiting-header">
        <div className="page-eyebrow">
          <Wifi size={12} />
          <span>Room Lobby</span>
        </div>
        <h2 className="waiting-room-name">{room.name}</h2>
        <div className="waiting-meta-row">
          <span className="waiting-meta-chip">
            <Users size={12} />
            {players.length} player{players.length !== 1 ? "s" : ""} joined
          </span>
          <span className="waiting-meta-chip">
            <Coins size={12} />
            Pot:{" "}
            <strong style={{ color: "var(--color-war-gold)" }}>
              {room.pot_total.toLocaleString()} $WAR
            </strong>
          </span>
          <span className="waiting-meta-chip">
            {room.total_rounds} rounds
          </span>
        </div>
      </div>

      {/* QR + code */}
      <RoomCodeDisplay code={room.code} joinUrl={joinUrl} />

      <div className="divider-cyber" style={{ width: "100%" }} />

      {/* Player list */}
      <div className="waiting-players" style={{ width: "100%" }}>
        <p className="waiting-section-label">
          Players — {players.length} in lobby
        </p>
        <ul className="waiting-player-list">
          {players.map((player) => (
            <li key={player.id} className="waiting-player-row">
              <div className="waiting-player-left">
                <span className="waiting-player-avatar">
                  {player.avatar_emoji}
                </span>
                <div>
                  <p className="waiting-player-handle">
                    {player.handle}
                    {player.user_id === (typeof window !== "undefined"
                      ? undefined : undefined) && (
                      <span className="waiting-you-badge">YOU</span>
                    )}
                  </p>
                  {player.is_host && (
                    <p className="waiting-host-label">
                      <Crown size={10} /> Host
                    </p>
                  )}
                </div>
              </div>
              <span className="waiting-ready-badge waiting-ready-badge--ready">
                READY
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Entry fee */}
      {room.entry_fee > 0 && (
        <div className="waiting-fee-notice">
          <Coins size={13} style={{ color: "var(--color-war-gold)" }} />
          <span>
            Entry fee:{" "}
            <strong style={{ color: "var(--color-war-gold)" }}>
              {room.entry_fee} $WAR
            </strong>{" "}
            per player · Winner takes the pot
          </span>
        </div>
      )}

      {/* Start button — host only */}
      {isHost ? (
        <button
          className={canStart ? "btn-neon-cyan" : "btn-ghost-cyan"}
          style={{ width: "100%", maxWidth: "360px" }}
          onClick={onStart}
        >
          <Play size={14} />
          {canStart ? "Start Match" : "Waiting for players…"}
        </button>
      ) : (
        <p className="waiting-fee-notice">
          Waiting for the host to start the match…
        </p>
      )}
    </div>
  );
}