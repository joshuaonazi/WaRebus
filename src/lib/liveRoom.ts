// src/lib/liveRoom.ts
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { CreateRoomInput, LiveRoom, LiveRoomPlayer, LiveRoomQuestion } from "@/types/liveRoom";

// ── Generate a unique 6-char code ─────────────────────────
async function getUniqueCode(): Promise<string> {
  const { data } = await supabase.rpc("generate_room_code");
  // Verify it's not already taken
  const { data: existing } = await supabase
    .from("live_rooms")
    .select("code")
    .eq("code", data)
    .single();
  if (existing) return getUniqueCode(); // retry if collision
  return data as string;
}

// ── Create a new room ──────────────────────────────────────
export async function createRoom(
  hostId: string,
  input: CreateRoomInput
): Promise<LiveRoom | null> {
  if (!isSupabaseConfigured) return null;

  const code = await getUniqueCode();

  // Insert room
  const { data: room, error: roomError } = await supabase
    .from("live_rooms")
    .insert({
      code,
      host_id: hostId,
      name: input.name,
      entry_fee: input.entryFee,
      pot_total: 0,
      total_rounds: input.questions.length,
      status: "lobby",
    })
    .select()
    .single();

  if (roomError || !room) {
    console.error("createRoom error:", roomError);
    return null;
  }

  // Insert questions
  const questionsToInsert = input.questions.map((q, i) => ({
    room_id: room.id,
    round_number: i + 1,
    source: q.source,
    puzzle_id: q.puzzleId ?? null,
    segments: q.segments as unknown as Record<string, unknown>[],
    options: q.options as unknown as Record<string, unknown>[],
    correct_option_id: q.correctOptionId,
    time_limit: q.timeLimit,
    reward: q.reward,
  }));

  const { error: qError } = await supabase
    .from("live_room_questions")
    .insert(questionsToInsert);

  if (qError) {
    console.error("createRoom questions error:", qError);
    return null;
  }

  // Host joins as first player
  await joinRoom(room.id, hostId, true);

  return room as LiveRoom;
}

// ── Join a room ────────────────────────────────────────────
export async function joinRoom(
  roomId: string,
  userId: string,
  isHost = false
): Promise<LiveRoomPlayer | null> {
  if (!isSupabaseConfigured) return null;

  // Get profile for handle + avatar
  const { data: profile } = await supabase
    .from("profiles")
    .select("handle, avatar_emoji")
    .eq("id", userId)
    .single();

  if (!profile) return null;

  const { data: player, error } = await supabase
    .from("live_room_players")
    .upsert(
      {
        room_id: roomId,
        user_id: userId,
        handle: profile.handle,
        avatar_emoji: profile.avatar_emoji,
        is_host: isHost,
        score: 0,
        streak: 0,
      },
      { onConflict: "room_id,user_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("joinRoom error:", error);
    return null;
  }

  // Update pot total
  const { data: room } = await supabase
    .from("live_rooms")
    .select("entry_fee, pot_total")
    .eq("id", roomId)
    .single();

  if (room && room.entry_fee > 0 && !isHost) {
    await supabase
      .from("live_rooms")
      .update({ pot_total: room.pot_total + room.entry_fee })
      .eq("id", roomId);
  }

  return player as LiveRoomPlayer;
}

// ── Find room by code ──────────────────────────────────────
export async function getRoomByCode(code: string): Promise<LiveRoom | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from("live_rooms")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();

  if (error) return null;
  return data as LiveRoom;
}

// ── Get room by ID ─────────────────────────────────────────
export async function getRoomById(roomId: string): Promise<LiveRoom | null> {
  if (!isSupabaseConfigured) return null;

  const { data } = await supabase
    .from("live_rooms")
    .select("*")
    .eq("id", roomId)
    .single();

  return data as LiveRoom ?? null;
}

// ── Get players in a room ──────────────────────────────────
export async function getRoomPlayers(roomId: string): Promise<LiveRoomPlayer[]> {
  if (!isSupabaseConfigured) return [];

  const { data } = await supabase
    .from("live_room_players")
    .select("*")
    .eq("room_id", roomId)
    .order("score", { ascending: false });

  return (data ?? []) as LiveRoomPlayer[];
}

// ── Get questions for a room ───────────────────────────────
export async function getRoomQuestions(roomId: string): Promise<LiveRoomQuestion[]> {
  if (!isSupabaseConfigured) return [];

  const { data } = await supabase
    .from("live_room_questions")
    .select("*")
    .eq("room_id", roomId)
    .order("round_number", { ascending: true });

  return (data ?? []) as unknown as LiveRoomQuestion[];
}

// ── Advance room status (host only) ───────────────────────
export async function updateRoomStatus(
  roomId: string,
  update: {
    status: string;
    current_round?: number;
    current_question_id?: string | null;
    question_started_at?: string | null;
    winner_id?: string | null;
  }
): Promise<void> {
  if (!isSupabaseConfigured) return;

  await supabase
    .from("live_rooms")
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq("id", roomId);
}

// ── Submit an answer ───────────────────────────────────────
export async function submitAnswer({
  roomId,
  questionId,
  playerId,
  optionId,
  correctOptionId,
  timeLimit,
  reward,
  answeredAtMs,
}: {
  roomId: string;
  questionId: string;
  playerId: string;
  optionId: string;
  correctOptionId: string;
  timeLimit: number;
  reward: number;
  answeredAtMs: number;
}): Promise<{ correct: boolean; pointsEarned: number }> {
  if (!isSupabaseConfigured) return { correct: false, pointsEarned: 0 };

  const correct = optionId === correctOptionId;
  const timeBonus = correct
    ? Math.floor(((timeLimit * 1000 - answeredAtMs) / (timeLimit * 1000)) * 100)
    : 0;
  const pointsEarned = correct ? reward + timeBonus : 0;

  // Save answer
  await supabase.from("live_room_answers").insert({
    room_id: roomId,
    question_id: questionId,
    player_id: playerId,
    option_id: optionId,
    correct,
    points_earned: pointsEarned,
    answered_at_ms: answeredAtMs,
  });

  // Update player score and streak
  if (correct) {
    const { data: player } = await supabase
      .from("live_room_players")
      .select("score, streak")
      .eq("id", playerId)
      .single();

    if (player) {
      await supabase
        .from("live_room_players")
        .update({
          score: player.score + pointsEarned,
          streak: player.streak + 1,
        })
        .eq("id", playerId);
    }
  } else {
    await supabase
      .from("live_room_players")
      .update({ streak: 0 })
      .eq("id", playerId);
  }

  return { correct, pointsEarned };
}