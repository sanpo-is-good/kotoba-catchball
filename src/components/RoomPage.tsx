'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import WaitingRoom from './WaitingRoom';
import GameRoom from './GameRoom';
import ResultScreen from './ResultScreen';
import { Suspense } from 'react';

function RoomPageInner({ roomId }: { roomId: string }) {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') ?? 'ゲスト';
  const joining = searchParams.get('joining') === '1';

  const { room, joinRoom, currentPlayer, isConnected } = useGame();

  // If joining (not creating), emit join-room once connected
  useEffect(() => {
    if (joining && isConnected && !room) {
      joinRoom(roomId, name);
    }
  }, [joining, isConnected, room, roomId, name, joinRoom]);

  if (!room) {
    return <WaitingRoom roomId={roomId} playerName={name} />;
  }

  if (room.status === 'finished') {
    return <ResultScreen />;
  }

  if (room.status === 'waiting') {
    return <WaitingRoom roomId={roomId} playerName={name} />;
  }

  return <GameRoom />;
}

export default function RoomPage({ roomId }: { roomId: string }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0a1e' }}>
        <div className="text-white text-lg">読み込み中...</div>
      </div>
    }>
      <RoomPageInner roomId={roomId} />
    </Suspense>
  );
}
