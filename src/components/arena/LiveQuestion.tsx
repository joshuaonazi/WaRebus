// src/components/arena/LiveQuestion.tsx
"use client";

import { Zap } from "lucide-react";
import type { LiveQuestion as LiveQuestionType, AnswerOption } from "@/types/arena";
import RebusRenderer from "@/components/puzzle/RebusRenderer";

interface Props {
  question: LiveQuestionType;
  timeRemaining: number;
  selectedOptionId: string | null;
  correctOptionId?: string;     // revealed after answer
  onSelect: (optionId: string) => void;
  round: number;
  totalRounds: number;
}

export default function LiveQuestion({
  question,
  timeRemaining,
  selectedOptionId,
  correctOptionId,
  onSelect,
  round,
  totalRounds,
}: Props) {
  const timePercent = (timeRemaining / question.timeLimit) * 100;
  const isUrgent = timeRemaining <= 5;
  const answered = !!selectedOptionId;

  function getOptionStyle(opt: AnswerOption): string {
    if (!answered) return "lq-option";
    if (opt.id === correctOptionId) return "lq-option lq-option--correct";
    if (opt.id === selectedOptionId) return "lq-option lq-option--wrong";
    return "lq-option lq-option--dim";
  }

  return (
    <div className="lq-root">

      {/* Round indicator + timer bar */}
      <div className="lq-top-bar">
        <span className="lq-round-label">
          Round {round} of {totalRounds}
        </span>
        <span className={`lq-timer-num ${isUrgent ? "lq-timer-urgent" : ""}`}>
          <Zap size={13} />
          {timeRemaining}s
        </span>
      </div>

      {/* Progress bar */}
      <div className="lq-timer-track">
        <div
          className={`lq-timer-fill ${isUrgent ? "lq-timer-fill--urgent" : ""}`}
          style={{ width: `${timePercent}%` }}
        />
      </div>

      {/* Puzzle */}
      <div className="glass-card-cyan lq-puzzle-canvas">
        <RebusRenderer
          segments={question.segments}
          revealedTiles={[]}
          onHint={() => {}}
          disabled={true}
        />
      </div>

      {/* Options grid */}
      <div className="lq-options-grid">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            className={getOptionStyle(opt)}
            onClick={() => !answered && onSelect(opt.id)}
            disabled={answered}
          >
            <span className="lq-option-emoji">{opt.emoji}</span>
            <span className="lq-option-label">{opt.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}