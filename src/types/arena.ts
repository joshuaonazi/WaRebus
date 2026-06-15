// src/types/arena.ts

export type RoomStatus = "waiting" | "starting" | "live" | "finished";
export type PlayerStatus = "waiting" | "ready" | "playing" | "disconnected";

export interface ArenaPlayer {
  id: string;
  handle: string;
  avatarEmoji: string;
  status: PlayerStatus;
  score: number;
  streak: number;
  isHost: boolean;
  isYou?: boolean;
}

export interface ArenaRoom {
  id: string;
  name: string;
  hostId: string;
  status: RoomStatus;
  players: ArenaPlayer[];
  maxPlayers: number;
  entryFee: number;       // $WAR to enter
  potTotal: number;       // accumulated $WAR pot
  currentRound: number;
  totalRounds: number;
  createdAt: number;
}

export type AnswerOption = {
  id: string;
  label: string;          // display text
  emoji?: string;
};

export interface LiveQuestion {
  id: string;
  round: number;
  segments: import("./puzzle").RebusSegment[];
  options: AnswerOption[]; // 4 multiple-choice options
  correctOptionId: string;
  timeLimit: number;       // seconds
  reward: number;          // $WAR for correct answer
}

export interface PlayerAnswer {
  playerId: string;
  optionId: string;
  answeredAt: number;      // ms since question started
  correct: boolean;
  pointsEarned: number;
}

export type RoundResult = {
  questionId: string;
  correctOptionId: string;
  playerAnswers: PlayerAnswer[];
  standings: Pick<ArenaPlayer, "id" | "handle" | "score" | "streak">[];
};