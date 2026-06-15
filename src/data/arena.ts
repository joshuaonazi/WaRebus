// src/data/arena.ts
import type { ArenaRoom, ArenaPlayer, LiveQuestion } from "@/types/arena";
import { SEED_PUZZLES } from "./puzzles";

export const MOCK_YOU: ArenaPlayer = {
  id: "you",
  handle: "Web3Cryptic",
  avatarEmoji: "🎮",
  status: "waiting",
  score: 0,
  streak: 0,
  isHost: false,
  isYou: true,
};

export const MOCK_PLAYERS: ArenaPlayer[] = [
  {
    id: "p1",
    handle: "0xSatoshi",
    avatarEmoji: "🐉",
    status: "ready",
    score: 0,
    streak: 0,
    isHost: true,
    isYou: false,
  },
  {
    id: "p2",
    handle: "CipherWitch",
    avatarEmoji: "🔮",
    status: "ready",
    score: 0,
    streak: 0,
    isHost: false,
    isYou: false,
  },
  {
    id: "p3",
    handle: "RebusKing",
    avatarEmoji: "👑",
    status: "waiting",
    score: 0,
    streak: 0,
    isHost: false,
    isYou: false,
  },
  MOCK_YOU,
];

export const MOCK_ROOM: ArenaRoom = {
  id: "room-degen-pit",
  name: "Degen Pit",
  hostId: "p1",
  status: "waiting",
  players: MOCK_PLAYERS,
  maxPlayers: 10,
  entryFee: 100,
  potTotal: 400,
  currentRound: 0,
  totalRounds: 5,
  createdAt: Date.now(),
};

export const MOCK_QUESTIONS: LiveQuestion[] = SEED_PUZZLES.map((p, i) => ({
  id: `q-${i + 1}`,
  round: i + 1,
  segments: p.segments,
  timeLimit: 20,
  reward: 200,
  correctOptionId: `opt-a-${i}`,
  options: [
    { id: `opt-a-${i}`, label: p.answer.toUpperCase(), emoji: "✅" },
    { id: `opt-b-${i}`, label: "ETHEREUM",  emoji: "🔷" },
    { id: `opt-c-${i}`, label: "DOGECOIN",  emoji: "🐕" },
    { id: `opt-d-${i}`, label: "SOLANA",    emoji: "☀️" },
  ],
}));