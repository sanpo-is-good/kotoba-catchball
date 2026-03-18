'use client';

import { useGame } from '@/contexts/GameContext';
import GameHUD from './GameHUD';
import GameField from './GameField';
import MessageInput from './MessageInput';

export default function GameRoom() {
  const { room, messages, currentPlayer, sendMessage, socketId } = useGame();

  if (!room) return null;

  const me       = room.players.find(p => p.id === socketId) ?? currentPlayer;
  const opponent = room.players.find(p => p.id !== socketId);

  const myName       = me?.name       ?? 'あなた';
  const opponentName = opponent?.name ?? '相手';

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: '#050114' }}>
      {/* HUD */}
      <GameHUD
        score={room.score}
        rally={room.rally}
        myName={myName}
        opponentName={opponentName}
      />

      {/* 2D Game field — fills remaining space */}
      <GameField
        messages={messages}
        socketId={socketId}
        myName={myName}
        opponentName={opponentName}
      />

      {/* Message input */}
      <MessageInput
        onSend={sendMessage}
        disabled={room.status === 'finished'}
      />
    </div>
  );
}
