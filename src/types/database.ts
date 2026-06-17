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
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}