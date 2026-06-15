// src/components/puzzle/AnswerInput.tsx
"use client";

import { useState } from "react";
import { Send, AlertCircle } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  attempts: number;
  maxAttempts: number;
  disabled: boolean;
  lastWasWrong: boolean;
}

export default function AnswerInput({
  value,
  onChange,
  onSubmit,
  attempts,
  maxAttempts,
  disabled,
  lastWasWrong,
}: Props) {
  const [shake, setShake] = useState(false);

  function handleSubmit() {
    if (!value.trim()) return;
    if (lastWasWrong) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    onSubmit();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  const attemptsLeft = maxAttempts - attempts;

  return (
    <div className={`answer-input-wrap ${shake ? "answer-shake" : ""}`}>
      {/* Wrong answer flash */}
      {lastWasWrong && (
        <div className="answer-wrong-hint">
          <AlertCircle size={13} />
          <span>Not quite — {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} left</span>
        </div>
      )}

      <div className="answer-input-row">
        <input
          type="text"
          className="answer-input"
          placeholder="Type your answer…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          maxLength={48}
        />
        <button
          className="answer-submit-btn"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          aria-label="Submit answer"
        >
          <Send size={16} />
        </button>
      </div>

      {/* Attempt pips */}
      <div className="attempt-pips">
        {Array.from({ length: maxAttempts }).map((_, i) => (
          <span
            key={i}
            className={`attempt-pip ${
              i < attempts ? "attempt-pip--used" : "attempt-pip--open"
            }`}
          />
        ))}
      </div>
    </div>
  );
}