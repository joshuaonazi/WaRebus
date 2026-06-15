// src/components/puzzle/CountdownTimer.tsx
"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function getSecondsUntilMidnightUTC(): number {
  const now = new Date();
  const midnight = new Date();
  midnight.setUTCHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function CountdownTimer() {
  const [seconds, setSeconds] = useState(getSecondsUntilMidnightUTC());

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(getSecondsUntilMidnightUTC());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="daily-meta-chip">
      <Clock size={13} />
      <span>
        Resets in <strong style={{ fontFamily: "var(--font-mono)", color: "white" }}>
          {formatTime(seconds)}
        </strong>
      </span>
    </div>
  );
}