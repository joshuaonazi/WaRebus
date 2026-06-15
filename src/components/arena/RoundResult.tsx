// src/components/arena/RoundResult.tsx
"use client";

import { CheckCircle, XCircle, ChevronRight, Zap } from "lucide-react";
import type { RoundResult as RoundResultType } from "@/types/arena";

interface Props {
  result: RoundResultType;
  onNext: () => void;
  isLastRound: boolean;
}

export default function RoundResult({ result, onNext, isLastRound }: Props) {
  const myAnswer = result.playerAnswers.find((a) => a.playerId === "you");
  const won = myAnswer?.correct ?? false;

  return (
    <div className="rr-root">

      {/* Correct / wrong banner */}
      <div className={`rr-banner ${won ? "rr-banner--correct" : "rr-banner--wrong"}`}>
        {won
          ? <><CheckCircle size={22} /> Correct! +{myAnswer?.pointsEarned} $WAR</>
          : <><XCircle size={22} /> Wrong answer</>
        }
      </div>

      {/* Live standings */}
      <div className="glass-card rr-standings">
        <p className="waiting-section-label" style={{ marginBottom: "0.75rem" }}>
          Standings
        </p>
        <ol className="rr-standings-list">
          {result.standings.map((p, i) => (
            <li key={p.id} className="rr-standing-row">
              <span className="rr-standing-rank">{i + 1}</span>
              <span className="rr-standing-handle">{p.handle}</span>
              {p.streak > 1 && (
                <span className="rr-streak-badge">
                  <Zap size={10} /> {p.streak}x
                </span>
              )}
              <span className="rr-standing-score">
                {p.score.toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <button className="btn-neon-cyan" style={{ width: "100%", maxWidth: "360px" }} onClick={onNext}>
        {isLastRound ? "See Final Results" : "Next Round"}
        <ChevronRight size={14} />
      </button>
    </div>
  );
}