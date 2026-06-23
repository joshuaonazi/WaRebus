// src/types/liveRoom.ts
import type { RebusSegment } from "./puzzle";

export type RoomStatus =
  | "lobby"
  | "countdown"
  | "question"
  | "round_result"
  | "finished";

export interface LiveRoom {
  id: string;
  code: string;
  host_id: string;
  name: string;
  status: RoomStatus;
  entry_fee: number;
  pot_total: number;
  current_round: number;
  total_rounds: number;
  current_question_id: string | null;
  question_started_at: string | null;
  winner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LiveRoomQuestionOption {
  id: string;
  label: string;
  emoji?: string;
}

export interface LiveRoomQuestion {
  id: string;
  room_id: string;
  round_number: number;
  source: "bank" | "custom";
  puzzle_id: string | null;
  segments: RebusSegment[];
  options: LiveRoomQuestionOption[];
  correct_option_id: string;
  time_limit: number;
  reward: number;
  created_at: string;
}

export interface LiveRoomPlayer {
  id: string;
  room_id: string;
  user_id: string;
  handle: string;
  avatar_emoji: string;
  score: number;
  streak: number;
  is_host: boolean;
  joined_at: string;
}

export interface LiveRoomAnswer {
  id: string;
  room_id: string;
  question_id: string;
  player_id: string;
  option_id: string;
  correct: boolean;
  points_earned: number;
  answered_at_ms: number;
  created_at: string;
}

// ── Question draft used during room creation ───────────────
export interface QuestionDraft {
  source: "bank" | "custom";
  puzzleId?: string;            // if source === "bank"
  segments: RebusSegment[];
  options: LiveRoomQuestionOption[];
  correctOptionId: string;
  timeLimit: number;
  reward: number;
}

export interface CreateRoomInput {
  name: string;
  entryFee: number;
  questions: QuestionDraft[];
}