// src/data/puzzles.ts
import type { Puzzle } from "@/types/puzzle";

/**
 * Seed puzzles — will be replaced by Supabase DB fetch later.
 * Answer logic: read each tile's `value` and apply operators.
 *
 * Example — BITCOIN:
 *   🍬 (BIT) + 🌽 (CORN) - 🌽➡️N (remove N, keep COR→CO) ... simplified:
 *   🐝 "BEE" - "EE" + "IT" ... 
 *
 * For this seed we use straightforward phonetic combos.
 */
export const SEED_PUZZLES: Puzzle[] = [
  {
    id: "puzzle-001",
    date: "2026-06-12",
    difficulty: "easy",
    category: "Crypto Basics",
    answer: "bitcoin",
    alternateAnswers: ["bit coin"],
    baseReward: 500,
    hintCostPerTile: 50,
    explanation:
      "BIT (a small unit of data) + COIN (currency) = BITCOIN, the first cryptocurrency.",
    segments: [
      {
        tile: {
          id: "t1",
          kind: "image",
          display: "🔩",
          value: "bit",
        },
        operator: "+",
      },
      {
        tile: {
          id: "t2",
          kind: "image",
          display: "🪙",
          value: "coin",
        },
      },
    ],
  },
  {
    id: "puzzle-002",
    date: "2026-06-13",
    difficulty: "medium",
    category: "DeFi",
    answer: "wallet",
    alternateAnswers: [],
    baseReward: 750,
    hintCostPerTile: 75,
    explanation:
      "WALL (a barrier) + IT (pronoun) = WALLET, where you store your crypto.",
    segments: [
      {
        tile: {
          id: "t1",
          kind: "image",
          display: "🧱",
          value: "wall",
        },
        operator: "+",
      },
      {
        tile: {
          id: "t2",
          kind: "letter",
          display: "ET",
          value: "et",
        },
      },
    ],
  },
  {
    id: "puzzle-003",
    date: "2026-06-14",
    difficulty: "hard",
    category: "Web3",
    answer: "blockchain",
    alternateAnswers: ["block chain"],
    baseReward: 1000,
    hintCostPerTile: 100,
    explanation:
      "BLOCK (a cube shape) + CHAIN (linked rings) = BLOCKCHAIN, the ledger that powers crypto.",
    segments: [
      {
        tile: {
          id: "t1",
          kind: "image",
          display: "🟦",
          value: "block",
        },
        operator: "+",
      },
      {
        tile: {
          id: "t2",
          kind: "image",
          display: "⛓️",
          value: "chain",
        },
      },
    ],
  },
];

/** Returns today's puzzle based on date match, falls back to first. */
export function getTodaysPuzzle(): Puzzle {
  const today = new Date().toISOString().split("T")[0];
  return (
    SEED_PUZZLES.find((p) => p.date === today) ?? SEED_PUZZLES[0]
  );
}