// src/lib/war.ts
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// ── Credit $WAR to a user's balance ───────────────────────
export async function creditWar(
  userId: string,
  amount: number
): Promise<{ newBalance: number } | null> {
  if (!isSupabaseConfigured || amount <= 0) return null;

  const { data, error } = await supabase.rpc("increment_war_balance", {
    user_id: userId,
    amount,
  });

  if (error) {
    console.error("creditWar error:", error);
    return null;
  }

  return { newBalance: data };
}

// ── Save a daily puzzle attempt ────────────────────────────
export async function saveDailyAttempt({
  userId,
  puzzleId,
  solved,
  attempts,
  hintsUsed,
  warEarned,
  solveTimeSeconds,
}: {
  userId: string;
  puzzleId: string;
  solved: boolean;
  attempts: number;
  hintsUsed: number;
  warEarned: number;
  solveTimeSeconds: number | null;
}): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { error } = await supabase.from("daily_attempts").upsert(
    {
      user_id: userId,
      puzzle_id: puzzleId,
      solved,
      attempts,
      hints_used: hintsUsed,
      war_earned: warEarned,
      solve_time_seconds: solveTimeSeconds,
    },
    { onConflict: "user_id,puzzle_id" }
  );

  if (error) {
    console.error("saveDailyAttempt error:", error);
    return false;
  }

  if (solved && warEarned > 0) {
    await creditWar(userId, warEarned);
  }

  return true;
}

// ── Update streak ──────────────────────────────────────────
export async function updateStreak(userId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const today = new Date().toISOString().split("T")[0];

  const { data: profile } = await supabase
    .from("profiles")
    .select("streak, last_played_date")
    .eq("id", userId)
    .single();

  if (!profile) return;

  const last = profile.last_played_date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const newStreak =
    last === yesterdayStr
      ? profile.streak + 1  // consecutive day
      : last === today
      ? profile.streak       // already played today
      : 1;                   // streak broken

  await supabase
    .from("profiles")
    .update({
      streak: newStreak,
      last_played_date: today,
      total_solved: profile.streak >= 0
        ? undefined
        : 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

// ── Save arena match result ────────────────────────────────
export async function saveArenaMatch({
  roomName,
  winnerId,
  potTotal,
  totalRounds,
  participants,
}: {
  roomName: string;
  winnerId: string | null;
  potTotal: number;
  totalRounds: number;
  participants: {
    userId: string;
    score: number;
    rank: number;
    warEarned: number;
  }[];
}): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  // Create match record
  const { data: match, error: matchError } = await supabase
    .from("arena_matches")
    .insert({ room_name: roomName, winner_id: winnerId, pot_total: potTotal, total_rounds: totalRounds })
    .select()
    .single();

  if (matchError || !match) {
    console.error("saveArenaMatch error:", matchError);
    return false;
  }

  // Save participants
  const { error: partError } = await supabase
    .from("arena_participants")
    .insert(
      participants.map((p) => ({
        match_id: match.id,
        user_id: p.userId,
        score: p.score,
        rank: p.rank,
        war_earned: p.warEarned,
      }))
    );

  if (partError) {
    console.error("saveArenaParticipants error:", partError);
    return false;
  }

  // Credit $WAR to winner
  if (winnerId) {
    await creditWar(winnerId, potTotal);
  }

  return true;
}

// ── Fetch leaderboard ──────────────────────────────────────
export async function fetchLeaderboard(limit = 20) {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, handle, avatar_emoji, war_balance, streak, total_solved")
    .order("war_balance", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("fetchLeaderboard error:", error);
    return [];
  }

  return data ?? [];
}

// ── Check if user already played today ────────────────────
export async function getTodaysAttempt(userId: string, puzzleId: string) {
  if (!isSupabaseConfigured) return null;

  const { data } = await supabase
    .from("daily_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("puzzle_id", puzzleId)
    .single();

  return data ?? null;
}