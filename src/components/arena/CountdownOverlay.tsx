// src/components/arena/CountdownOverlay.tsx
"use client";

interface Props { value: number; }

export default function CountdownOverlay({ value }: Props) {
  return (
    <div className="countdown-overlay">
      <div className="countdown-ring">
        <span className="countdown-number">{value}</span>
      </div>
      <p className="countdown-label">Get ready…</p>
    </div>
  );
}