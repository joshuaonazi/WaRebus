// src/app/arena/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, Hash, Loader2, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { createRoom } from "@/lib/liveRoom";
import CreateRoomModal from "@/components/arena/CreateRoomModal";
import type { QuestionDraft } from "@/types/liveRoom";
import type { LiveRoom } from "@/types/liveRoom";

export default function ArenaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [rooms, setRooms] = useState<LiveRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  // Fetch open rooms
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function fetchRooms() {
      const { data } = await supabase
        .from("live_rooms")
        .select("*")
        .in("status", ["lobby", "question", "countdown", "round_result"])
        .order("created_at", { ascending: false })
        .limit(20);
      setRooms((data ?? []) as LiveRoom[]);
      setLoadingRooms(false);
    }

    fetchRooms();

    // Realtime: update list when rooms change
    const sub = supabase
      .channel("arena-lobby")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_rooms" },
        () => fetchRooms()
      )
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, []);

  async function handleCreateRoom(
    name: string,
    entryFee: number,
    questions: QuestionDraft[]
  ) {
    if (!user) return;
    setCreating(true);
    const room = await createRoom(user.id, { name, entryFee, questions });
    setCreating(false);
    setShowCreate(false);
    if (room) router.push(`/arena/room/${room.id}`);
  }

  const statusLabel: Record<string, string> = {
    lobby: "WAITING",
    countdown: "STARTING",
    question: "LIVE",
    round_result: "LIVE",
    finished: "FINISHED",
  };

  const statusColor: Record<string, string> = {
    lobby: "var(--color-cyan-neon)",
    countdown: "var(--color-war-gold)",
    question: "var(--color-magenta-neon)",
    round_result: "var(--color-magenta-neon)",
  };

  return (
    <div className="page-container">
      <section className="page-header">
        <div className="page-eyebrow">
          <Users size={12} />
          <span>Live Arena</span>
        </div>
        <h1 className="page-title">
          Enter the <span className="text-neon-magenta">Arena</span>
        </h1>
        <p className="page-subtitle">
          Join a live room or create your own. Winner takes the $WAR pot.
        </p>
      </section>

      <div className="divider-cyber" style={{ maxWidth: "480px", margin: "0 auto" }} />

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "0.75rem", width: "100%", maxWidth: "680px" }}>
        <button
          className="btn-neon-magenta"
          style={{ flex: 1 }}
          onClick={() => user ? setShowCreate(true) : null}
          disabled={!user}
        >
          <Plus size={14} /> Create Room
        </button>
        <button
          className="btn-ghost-cyan"
          style={{ flex: 1 }}
          onClick={() => router.push("/arena/join")}
          disabled={!user}
        >
          <Hash size={14} /> Enter Code
        </button>
      </div>

      {!user && (
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "rgba(255,215,0,0.6)",
        }}>
          Sign in to create or join rooms
        </p>
      )}

      {/* Room list */}
      <section className="arena-rooms-section" style={{ width: "100%", maxWidth: "680px" }}>
        <div className="arena-rooms-header">
          <h2 className="arena-rooms-title">Open Rooms</h2>
        </div>

        {loadingRooms ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
            <Loader2 size={20} className="auth-spinner" style={{ color: "var(--color-cyan-neon)" }} />
          </div>
        ) : rooms.length === 0 ? (
          <div className="glass-card" style={{ padding: "2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "rgba(255,255,255,0.25)" }}>
              No open rooms yet. Create one!
            </p>
          </div>
        ) : (
          <ul className="arena-room-list">
            {rooms.map((room) => (
              <li key={room.id}>
                <button
                  className="arena-room-card"
                  onClick={() => router.push(`/arena/room/${room.id}`)}
                >
                  <div className="arena-room-left">
                    <span
                      className="arena-status-dot"
                      style={{
                        background: statusColor[room.status] ?? "rgba(255,255,255,0.2)",
                        boxShadow: `0 0 6px ${statusColor[room.status] ?? "transparent"}`,
                      }}
                    />
                    <div>
                      <p className="arena-room-name">{room.name}</p>
                      <p className="arena-room-meta">
                        <Zap size={11} />
                        {room.total_rounds} rounds ·{" "}
                        {statusLabel[room.status] ?? room.status}
                      </p>
                    </div>
                  </div>
                  <div className="arena-room-right">
                    <span className="arena-room-reward">
                      {room.pot_total.toLocaleString()}{" "}
                      <span style={{ color: "rgba(255,215,0,0.5)", fontSize: "0.65rem" }}>
                        $WAR
                      </span>
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.6rem",
                        color: statusColor[room.status] ?? "rgba(255,255,255,0.2)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {statusLabel[room.status]}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showCreate && (
        <CreateRoomModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreateRoom}
          loading={creating}
        />
      )}
    </div>
  );
}