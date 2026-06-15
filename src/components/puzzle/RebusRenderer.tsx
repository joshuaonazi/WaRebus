// src/components/puzzle/RebusRenderer.tsx
"use client";

import type { RebusSegment } from "@/types/puzzle";
import RebusTileCard from "./RebusTileCard";

interface Props {
  segments: RebusSegment[];
  revealedTiles: string[];
  onHint: (tileId: string) => void;
  disabled: boolean;
}

const OPERATOR_LABELS: Record<string, string> = {
  "+": "+",
  "-": "−",
  "=": "=",
};

export default function RebusRenderer({ segments, revealedTiles, onHint, disabled }: Props) {
  return (
    <div className="rebus-renderer">
      {segments.map((seg, i) => (
        <div key={seg.tile.id} className="rebus-segment">
          <RebusTileCard
            tile={seg.tile}
            revealed={revealedTiles.includes(seg.tile.id)}
            onHint={onHint}
            disabled={disabled}
          />
          {seg.operator && (
            <span className="rebus-operator">
              {OPERATOR_LABELS[seg.operator] ?? seg.operator}
            </span>
          )}
        </div>
      ))}

      {/* Answer target */}
      <div className="rebus-segment">
        <div className="rebus-answer-target">
          <span className="rebus-operator">=</span>
          <div className="tile-card tile-card--answer">
            <span className="tile-emoji">?</span>
          </div>
        </div>
      </div>
    </div>
  );
}