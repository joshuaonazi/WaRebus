// src/components/arena/CreateRoomModal.tsx
"use client";

import { useState } from "react";
import { X, Plus, Trash2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { SEED_PUZZLES } from "@/data/puzzles";
import type { QuestionDraft } from "@/types/liveRoom";
import type { LiveRoomQuestionOption } from "@/types/liveRoom";

interface Props {
  onClose: () => void;
  onCreate: (name: string, entryFee: number, questions: QuestionDraft[]) => Promise<void>;
  loading: boolean;
}

const CRYPTO_OPTIONS: LiveRoomQuestionOption[][] = SEED_PUZZLES.map((p) => [
  { id: `correct-${p.id}`, label: p.answer.toUpperCase(), emoji: "✅" },
  { id: `wrong1-${p.id}`, label: "ETHEREUM",  emoji: "🔷" },
  { id: `wrong2-${p.id}`, label: "DOGECOIN",  emoji: "🐕" },
  { id: `wrong3-${p.id}`, label: "SOLANA",    emoji: "☀️" },
]);

function makeBankQuestion(puzzleIndex: number): QuestionDraft {
  const puzzle = SEED_PUZZLES[puzzleIndex];
  return {
    source: "bank",
    puzzleId: puzzle.id,
    segments: puzzle.segments,
    options: CRYPTO_OPTIONS[puzzleIndex],
    correctOptionId: `correct-${puzzle.id}`,
    timeLimit: 20,
    reward: 200,
  };
}

function makeCustomQuestion(): QuestionDraft {
  return {
    source: "custom",
    segments: [],
    options: [
      { id: "opt-a", label: "", emoji: "🅰️" },
      { id: "opt-b", label: "", emoji: "🅱️" },
      { id: "opt-c", label: "", emoji: "🅾️" },
      { id: "opt-d", label: "", emoji: "🆗" },
    ],
    correctOptionId: "opt-a",
    timeLimit: 20,
    reward: 200,
  };
}

export default function CreateRoomModal({ onClose, onCreate, loading }: Props) {
  const [name, setName] = useState("");
  const [entryFee, setEntryFee] = useState(100);
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    makeBankQuestion(0),
  ]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [error, setError] = useState<string | null>(null);

  function addBankQuestion() {
    const nextIndex = questions.filter((q) => q.source === "bank").length;
    if (nextIndex >= SEED_PUZZLES.length) return;
    setQuestions((prev) => [...prev, makeBankQuestion(nextIndex % SEED_PUZZLES.length)]);
    setExpandedIndex(questions.length);
  }

  function addCustomQuestion() {
    setQuestions((prev) => [...prev, makeCustomQuestion()]);
    setExpandedIndex(questions.length);
  }

  function removeQuestion(i: number) {
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));
    setExpandedIndex(null);
  }

  function updateCustomAnswer(qIndex: number, optIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        return {
          ...q,
          options: q.options.map((opt, oi) =>
            oi === optIndex ? { ...opt, label: value.toUpperCase() } : opt
          ),
        };
      })
    );
  }

  async function handleCreate() {
    if (!name.trim()) { setError("Room name is required."); return; }
    if (questions.length === 0) { setError("Add at least one question."); return; }
    setError(null);
    await onCreate(name.trim(), entryFee, questions);
  }

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div
        className="auth-modal glass-card create-room-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="auth-modal-header">
          <h2 className="auth-title">Create Room</h2>
          <button className="auth-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Room name */}
        <div className="auth-field">
          <label className="auth-label">Room Name</label>
          <input
            className="auth-input"
            style={{ paddingLeft: "1rem" }}
            type="text"
            placeholder="Degen Pit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={32}
          />
        </div>

        {/* Entry fee */}
        <div className="auth-field">
          <label className="auth-label">Entry Fee ($WAR per player)</label>
          <input
            className="auth-input"
            style={{ paddingLeft: "1rem" }}
            type="number"
            min={0}
            max={10000}
            value={entryFee}
            onChange={(e) => setEntryFee(Number(e.target.value))}
          />
        </div>

        {/* Questions */}
        <div className="auth-field">
          <label className="auth-label">
            Questions ({questions.length})
          </label>

          <div className="cr-question-list">
            {questions.map((q, i) => (
              <div key={i} className="cr-question-item">
                <div
                  className="cr-question-header"
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                >
                  <span className="cr-question-label">
                    Round {i + 1} —{" "}
                    {q.source === "bank"
                      ? `Bank: ${q.puzzleId}`
                      : "Custom question"}
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <button
                      className="cr-remove-btn"
                      onClick={(e) => { e.stopPropagation(); removeQuestion(i); }}
                    >
                      <Trash2 size={12} />
                    </button>
                    {expandedIndex === i
                      ? <ChevronUp size={14} />
                      : <ChevronDown size={14} />
                    }
                  </div>
                </div>

                {expandedIndex === i && q.source === "custom" && (
                  <div className="cr-question-body">
                    <p className="auth-label" style={{ marginBottom: "0.5rem" }}>
                      Answer options (first one = correct)
                    </p>
                    {q.options.map((opt, oi) => (
                      <div key={opt.id} className="cr-option-row">
                        <span className="cr-option-emoji">{opt.emoji}</span>
                        <input
                          className="auth-input cr-option-input"
                          style={{ paddingLeft: "0.75rem" }}
                          placeholder={oi === 0 ? "Correct answer" : `Wrong option ${oi}`}
                          value={opt.label}
                          onChange={(e) => updateCustomAnswer(i, oi, e.target.value)}
                        />
                        {oi === 0 && (
                          <span className="cr-correct-badge">✓ correct</span>
                        )}
                      </div>
                    ))}
                    <div className="auth-field" style={{ marginTop: "0.5rem" }}>
                      <label className="auth-label">Time limit (seconds)</label>
                      <input
                        className="auth-input"
                        style={{ paddingLeft: "1rem" }}
                        type="number"
                        min={10}
                        max={60}
                        value={q.timeLimit}
                        onChange={(e) =>
                          setQuestions((prev) =>
                            prev.map((pq, pi) =>
                              pi === i ? { ...pq, timeLimit: Number(e.target.value) } : pq
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {expandedIndex === i && q.source === "bank" && (
                  <div className="cr-question-body">
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                      Puzzle from the bank — segments and options are pre-configured.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add question buttons */}
          <div className="cr-add-row">
            <button className="btn-ghost-cyan cr-add-btn" onClick={addBankQuestion}>
              <Plus size={13} /> From Bank
            </button>
            <button className="btn-ghost-cyan cr-add-btn" onClick={addCustomQuestion}>
              <Plus size={13} /> Custom
            </button>
          </div>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button
          className="btn-neon-magenta"
          style={{ width: "100%" }}
          onClick={handleCreate}
          disabled={loading}
        >
          {loading
            ? <><Loader2 size={16} className="auth-spinner" /> Creating…</>
            : "Create Room"
          }
        </button>
      </div>
    </div>
  );
}