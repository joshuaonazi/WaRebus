// src/app/arena/room/[roomId]/page.tsx
"use client";

import { use } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLiveRoom } from "@/hooks/useLiveRoom";
import LiveWaitingRoom from "@/components/arena/LiveWaitingRoom";
import CountdownOverlay from "@/components/arena/CountdownOverlay";
import LiveQuestion from "@/components/arena/LiveQuestion";
import LiveRoundResult from "@/components/arena/LiveRoundResult";
import LiveFinalResult from "@/components/arena/LiveFinalResult";
import { Loader2 } from "lucide-react";

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const { user } = useAuth();
  const { state, hostStartGame, hostNextRound, playerSubmitAnswer } =
    useLiveRoom(roomId, user?.id ?? "");

  if (state.loading || !user) {
    return (
      <div className="page-container" style={{ justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Loader2 size={32} className="auth-spinner" style={{ color: "var(--color-cyan-neon)" }} />
      </div>
    );
  }

  if (!state.room) {
    return (
      <div className="page-container">
        <p className="page-subtitle">Room not found.</p>
      </div>
    );
  }

  const isHost = state.myPlayer?.is_host ?? false;
  const { room, players, currentQuestion, timeRemaining,
          selectedOptionId, countdownValue, questions } = state;

  return (
    <div className="page-container">
      {room.status === "lobby" && (
        <LiveWaitingRoom
          room={room}
          players={players}
          isHost={isHost}
          onStart={hostStartGame}
        />
      )}

      {room.status === "countdown" && (
        <CountdownOverlay value={countdownValue} />
      )}

      {room.status === "question" && currentQuestion && (
        <LiveQuestion
          question={currentQuestion}
          timeRemaining={timeRemaining}
          selectedOptionId={selectedOptionId}
          correctOptionId={undefined}
          onSelect={playerSubmitAnswer}
          round={room.current_round}
          totalRounds={room.total_rounds}
        />
      )}

      {room.status === "round_result" && currentQuestion && (
        <LiveRoundResult
          players={players}
          currentQuestion={currentQuestion}
          isHost={isHost}
          onNext={hostNextRound}
          isLastRound={room.current_round >= room.total_rounds}
        />
      )}

      {room.status === "finished" && (
        <LiveFinalResult
          room={room}
          players={players}
        />
      )}
    </div>
  );
}