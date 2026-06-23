// src/types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          handle: string;
          avatar_emoji: string;
          war_balance: number;
          streak: number;
          last_played_date: string | null;
          total_solved: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          handle: string;
          avatar_emoji?: string;
          war_balance?: number;
          streak?: number;
          last_played_date?: string | null;
          total_solved?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          handle?: string;
          avatar_emoji?: string;
          war_balance?: number;
          streak?: number;
          last_played_date?: string | null;
          total_solved?: number;
          updated_at?: string;
        };
      };
      daily_attempts: {
        Row: {
          id: string;
          user_id: string;
          puzzle_id: string;
          solved: boolean;
          attempts: number;
          hints_used: number;
          war_earned: number;
          solve_time_seconds: number | null;
          played_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          puzzle_id: string;
          solved: boolean;
          attempts: number;
          hints_used: number;
          war_earned: number;
          solve_time_seconds?: number | null;
          played_at?: string;
        };
        Update: {
          solved?: boolean;
          attempts?: number;
          hints_used?: number;
          war_earned?: number;
          solve_time_seconds?: number | null;
        };
      };
      arena_matches: {
        Row: {
          id: string;
          room_name: string;
          winner_id: string | null;
          pot_total: number;
          total_rounds: number;
          played_at: string;
        };
        Insert: {
          id?: string;
          room_name: string;
          winner_id?: string | null;
          pot_total: number;
          total_rounds: number;
          played_at?: string;
        };
        Update: {
          winner_id?: string | null;
        };
      };
      arena_participants: {
        Row: {
          id: string;
          match_id: string;
          user_id: string;
          score: number;
          rank: number | null;
          war_earned: number;
          played_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          user_id: string;
          score: number;
          rank?: number | null;
          war_earned: number;
          played_at?: string;
        };
        Update: {
          score?: number;
          rank?: number | null;
          war_earned?: number;
        };
      };
      live_rooms: {
        Row: {
          id: string;
          code: string;
          host_id: string;
          name: string;
          status: string;
          entry_fee: number;
          pot_total: number;
          current_round: number;
          total_rounds: number;
          current_question_id: string | null;
          question_started_at: string | null;
          winner_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          host_id: string;
          name: string;
          status?: string;
          entry_fee?: number;
          pot_total?: number;
          current_round?: number;
          total_rounds?: number;
          current_question_id?: string | null;
          question_started_at?: string | null;
          winner_id?: string | null;
        };
        Update: {
          status?: string;
          pot_total?: number;
          current_round?: number;
          current_question_id?: string | null;
          question_started_at?: string | null;
          winner_id?: string | null;
          updated_at?: string;
        };
      };
      live_room_questions: {
        Row: {
          id: string;
          room_id: string;
          round_number: number;
          source: string;
          puzzle_id: string | null;
          segments: Json;
          options: Json;
          correct_option_id: string;
          time_limit: number;
          reward: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          round_number: number;
          source?: string;
          puzzle_id?: string | null;
          segments: Json;
          options: Json;
          correct_option_id: string;
          time_limit?: number;
          reward?: number;
        };
        Update: {};
      };
      live_room_players: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          handle: string;
          avatar_emoji: string;
          score: number;
          streak: number;
          is_host: boolean;
          joined_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          handle: string;
          avatar_emoji?: string;
          score?: number;
          streak?: number;
          is_host?: boolean;
        };
        Update: {
          score?: number;
          streak?: number;
        };
      };
      live_room_answers: {
        Row: {
          id: string;
          room_id: string;
          question_id: string;
          player_id: string;
          option_id: string;
          correct: boolean;
          points_earned: number;
          answered_at_ms: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          question_id: string;
          player_id: string;
          option_id: string;
          correct: boolean;
          points_earned?: number;
          answered_at_ms: number;
        };
        Update: {};
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}