// src/types/puzzle.ts

// ─── Primitive tile types ────────────────────────────────────
export type TileKind =
  | "image"   // an emoji or image representing a word/sound
  | "letter"  // a single letter or short string (e.g. "S", "ED")
  | "number"; // a digit used phonetically (e.g. "4" = "for/fore")

export type Operator = "+" | "-" | "=";

// ─── A single rebus tile ─────────────────────────────────────
export interface RebusTile {
  id: string;
  kind: TileKind;
  /** What is displayed to the player — emoji, letter, or numeral */
  display: string;
  /**
   * The phonetic/semantic value this tile contributes to the answer.
   * Hidden from the player until a hint is used on this tile.
   */
  value: string;
  /** Optional: override the hint cost for this specific tile */
  hintCost?: number;
}

// ─── A rebus segment: tile + optional trailing operator ──────
export interface RebusSegment {
  tile: RebusTile;
  /** Operator that follows this tile. Undefined for the last segment. */
  operator?: Operator;
}

// ─── Difficulty ──────────────────────────────────────────────
export type Difficulty = "easy" | "medium" | "hard";

// ─── A complete puzzle ───────────────────────────────────────
export interface Puzzle {
  id: string;
  /** ISO date string — "2026-06-12" */
  date: string;
  segments: RebusSegment[];
  /** Canonical correct answer, lowercase, trimmed */
  answer: string;
  /** Alternate accepted spellings / phrasings */
  alternateAnswers?: string[];
  difficulty: Difficulty;
  /** $WAR reward for solving — decreases as hints are used */
  baseReward: number;
  /** Cost in $WAR per hint reveal */
  hintCostPerTile: number;
  /** Flavour category shown to player */
  category: string;
  /** Short explanation shown after solve */
  explanation: string;
}

// ─── Per-session game state ──────────────────────────────────
export type GameStatus =
  | "idle"      // not started
  | "playing"   // active
  | "correct"   // solved
  | "failed"    // out of attempts
  | "revealed"; // gave up / all hints used

export interface PuzzleGameState {
  puzzle: Puzzle;
  status: GameStatus;
  input: string;
  attempts: number;
  maxAttempts: number;
  hintsUsed: string[]; // tile IDs that have been revealed
  warEarned: number;
  startedAt: number;   // Date.now() timestamp
  solvedAt?: number;
}

// ─── Hint reveal result ──────────────────────────────────────
export interface HintResult {
  tileId: string;
  value: string;
  costDeducted: number;
  remainingReward: number;
}