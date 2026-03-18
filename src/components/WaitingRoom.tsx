'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';

export default function WaitingRoom({ roomId, playerName }: { roomId: string; playerName: string }) {
  const { room } = useGame();
  const [copied, setCopied] = useState(false);

  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(`${window.location.origin}/room/${roomId}?name=ゲスト&joining=1`);
  }, [roomId]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const playerCount = room?.players.length ?? 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
         style={{ background: 'linear-gradient(160deg, #0f0a1e 0%, #1a0a2e 50%, #0a1428 100%)' }}>

      <div className="text-5xl mb-4">⏳</div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: '#f0e6ff' }}>相手を待っています...</h2>
      <p className="text-sm mb-8" style={{ color: '#a09ab8' }}>
        あなた: <span className="font-bold" style={{ color: '#a855f7' }}>{playerName}</span>
      </p>

      {/* Room Code */}
      <div className="w-full max-w-xs mb-6">
        <p className="text-xs text-center mb-2" style={{ color: '#a09ab8' }}>ルームコード</p>
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#1a1333', border: '2px solid #7C3AED' }}>
          <span className="flex-1 text-center text-3xl font-mono font-bold tracking-widest" style={{ color: '#a855f7' }}>
            {roomId}
          </span>
          <button
            onClick={copyCode}
            className="px-3 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: '#7C3AED', color: 'white' }}
          >
            {copied ? '✓' : 'コピー'}
          </button>
        </div>
      </div>

      {/* Share URL */}
      <div className="w-full max-w-xs mb-8">
        <p className="text-xs text-center mb-2" style={{ color: '#a09ab8' }}>または招待リンクを共有</p>
        <button
          onClick={copyUrl}
          className="w-full py-3 rounded-xl text-sm transition-all active:scale-95"
          style={{ background: '#231a45', border: '1px solid #7C3AED', color: '#a855f7' }}
        >
          🔗 招待リンクをコピー
        </button>
      </div>

      {/* Player dots */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-sm" style={{ color: '#f0e6ff' }}>{playerName}</span>
        </div>
        <span style={{ color: '#a09ab8' }}>vs</span>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${playerCount >= 2 ? 'bg-green-400' : 'bg-gray-600 animate-pulse'}`} />
          <span className="text-sm" style={{ color: playerCount >= 2 ? '#f0e6ff' : '#a09ab8' }}>
            {playerCount >= 2 ? room?.players[1]?.name ?? '相手' : '待機中...'}
          </span>
        </div>
      </div>

      <p className="mt-8 text-xs text-center" style={{ color: '#a09ab8' }}>
        友達にルームコードを伝えて一緒に遊ぼう！
      </p>
    </div>
  );
}
