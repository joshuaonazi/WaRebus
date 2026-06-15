// src/components/puzzle/RebusTileCard.tsx
"use client";

import { Lightbulb, Eye } from "lucide-react";
import type { RebusTile } from "@/types/puzzle";

interface Props {
  tile: RebusTile;
  revealed: boolean;
  onHint: (tileId: string) => void;
  disabled: boolean;
}

export default function RebusTileCard({ tile, revealed, onHint, disabled }: Props) {
  return (
    <div className="tile-card">
      {/* Main display */}
      <div className={`tile-display ${revealed ? "tile-display--revealed" : ""}`}>
        <span className="tile-emoji">{tile.display}</span>
        {revealed && (
          <span className="tile-value-label">{tile.value.toUpperCase()}</span>
        )}
      </div>

      {/* Hint button */}
      {!revealed && !disabled && (
        <button
          className="tile-hint-btn"
          onClick={() => onHint(tile.id)}
          title={`Reveal this tile (-${tile.hintCost ?? 50} $WAR)`}
        >
          {revealed ? <Eye size={11} /> : <Lightbulb size={11} />}
        </button>
      )}
    </div>
  );
}