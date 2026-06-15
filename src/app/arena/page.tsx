// src/app/arena/page.tsx
"use client";

import { useArenaGame } from "@/hooks/useArenaGame";
import { MOCK_ROOM, MOCK_QUESTIONS } from "@/data/arena";
import WaitingRoom from "@/components/arena/WaitingRoom";
import LiveQuestion from "@/components/arena/LiveQuestion";
import RoundResult from "@/components/arena/RoundResult";
import FinalResult from "@/components/arena/FinalResult";
import CountdownOverlay from "@/components/arena/CountdownOverlay";

export default function ArenaPage() {
  const { state, startGame, selectAnswer, nextRound, resetGame } =
    useArenaGame(MOCK_ROOM, MOCK_QUESTIONS);

  const { phase, currentQuestion, timeRemaining, selectedOptionId,
          lastRoundResult, countdownValue, currentQuestionIndex, room } = state;

  return (
    <div className="page-container">

      {phase === "lobby" && (
        <WaitingRoom room={room} onStart={startGame} />
      )}

      {phase === "countdown" && (
        <CountdownOverlay value={countdownValue} />
      )}

      {phase === "question" && currentQuestion && (
        <LiveQuestion
          question={currentQuestion}
          timeRemaining={timeRemaining}
          selectedOptionId={selectedOptionId}
          onSelect={selectAnswer}
          round={currentQuestionIndex + 1}
          totalRounds={MOCK_QUESTIONS.length}
        />
      )}

      {phase === "round-result" && lastRoundResult && currentQuestion && (
        <RoundResult
          result={lastRoundResult}
          onNext={nextRound}
          isLastRound={currentQuestionIndex >= MOCK_QUESTIONS.length - 1}
        />
      )}

      {phase === "final-result" && (
        <FinalResult room={room} onReset={resetGame} />
      )}

    </div>
  );
}