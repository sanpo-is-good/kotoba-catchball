'use client';

import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';

// ─────────────────────────────────────────
// Park scene SVG background for top page
// ─────────────────────────────────────────
const TopPageScene = memo(function TopPageScene() {
  const W = 800, H = 900;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%" height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="tCrayon" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="tCrayonSoft" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="tRough" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="8" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="tCharRough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="turbulence" baseFrequency="0.06" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* ── Sky ── */}
      <rect x="0" y="0" width={W} height="440" fill="#62b6ff" filter="url(#tCrayonSoft)" />
      <rect x="0" y="0" width={W} height="160" fill="#8ad0ff" opacity="0.5" filter="url(#tCrayonSoft)" />

      {/* ── Cloud top-right ── */}
      <ellipse cx="620" cy="60" rx="90" ry="40" fill="white" opacity="0.85" filter="url(#tCrayon)" />
      <ellipse cx="660" cy="48" rx="60" ry="30" fill="white" opacity="0.8" filter="url(#tCrayon)" />
      {/* ── Cloud left ── */}
      <ellipse cx="130" cy="120" rx="60" ry="25" fill="white" opacity="0.7" filter="url(#tCrayon)" />

      {/* ── Tree left ── */}
      <rect x="110" y="280" width="16" height="50" fill="#6b4423" filter="url(#tRough)" />
      <ellipse cx="118" cy="265" rx="45" ry="45" fill="#2d8a30" filter="url(#tCrayon)" />
      <ellipse cx="105" cy="258" rx="28" ry="28" fill="#3aaa3e" filter="url(#tCrayon)" />
      <ellipse cx="132" cy="255" rx="25" ry="25" fill="#35993a" filter="url(#tCrayon)" />

      {/* ── Tree right ── */}
      <rect x="640" y="285" width="16" height="48" fill="#6b4423" filter="url(#tRough)" />
      <ellipse cx="648" cy="270" rx="42" ry="42" fill="#2d8a30" filter="url(#tCrayon)" />
      <ellipse cx="660" cy="263" rx="28" ry="26" fill="#35993a" filter="url(#tCrayon)" />

      {/* ── Ground / park grass ── */}
      <path d={`M0,370 Q200,360 400,368 Q600,362 ${W},370 L${W},${H} L0,${H} Z`}
        fill="#5cb85c" filter="url(#tCrayon)" />
      <path d={`M0,385 Q200,378 400,386 Q600,380 ${W},384 L${W},${H} L0,${H} Z`}
        fill="#6ccc6c" opacity="0.4" filter="url(#tCrayon)" />

      {/* ── Park bench ── */}
      <rect x="360" y="435" width="80" height="7" fill="#8B5E3C" rx="2" filter="url(#tRough)" />
      <rect x="360" y="448" width="80" height="7" fill="#7a5230" rx="2" filter="url(#tRough)" />
      <rect x="370" y="455" width="5" height="22" fill="#5a3a1a" filter="url(#tRough)" />
      <rect x="425" y="455" width="5" height="22" fill="#5a3a1a" filter="url(#tRough)" />

      {/* ── Park path ── */}
      <path d={`M300,${H} Q340,650 370,530 Q400,470 430,530 Q460,650 500,${H}`}
        fill="#d4a96a" filter="url(#tCrayon)" />
      <path d={`M320,${H} Q355,660 380,540 Q400,490 420,540 Q445,660 480,${H}`}
        fill="#c89b5a" opacity="0.4" filter="url(#tCrayon)" />

      {/* ── Left character (red shirt) ── */}
      <g transform="translate(160, 500)" filter="url(#tCharRough)">
        {/* Body */}
        <ellipse cx="0" cy="28" rx="22" ry="24" fill="#ff7777" stroke="#333" strokeWidth="2" />
        {/* Head */}
        <circle cx="0" cy="-10" r="22" fill="#ffe0b2" stroke="#333" strokeWidth="2" />
        {/* Hair */}
        <path d="M-22,-14 Q-17,-32 0,-34 Q17,-32 22,-14" fill="#5a3825" stroke="#333" strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx="-7" cy="-12" r="2.5" fill="#222" />
        <circle cx="7" cy="-12" r="2.5" fill="#222" />
        <circle cx="-6" cy="-13" r="1" fill="white" />
        <circle cx="8" cy="-13" r="1" fill="white" />
        {/* Cheeks */}
        <ellipse cx="-14" cy="-4" rx="4" ry="3" fill="#ffaaaa" opacity="0.5" />
        <ellipse cx="14" cy="-4" rx="4" ry="3" fill="#ffaaaa" opacity="0.5" />
        {/* Mouth */}
        <path d="M-6,-5 Q0,0 6,-5" fill="none" stroke="#333" strokeWidth="1.5" />
        {/* Arms */}
        <line x1="-20" y1="22" x2="-36" y2="35" stroke="#ffe0b2" strokeWidth="6" strokeLinecap="round" />
        <line x1="-20" y1="22" x2="-36" y2="35" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="22" x2="36" y2="8" stroke="#ffe0b2" strokeWidth="6" strokeLinecap="round" />
        <line x1="20" y1="22" x2="36" y2="8" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        {/* Legs */}
        <ellipse cx="-10" cy="50" rx="9" ry="11" fill="#4466aa" stroke="#333" strokeWidth="1.5" />
        <ellipse cx="10" cy="50" rx="9" ry="11" fill="#4466aa" stroke="#333" strokeWidth="1.5" />
        {/* Shoes */}
        <ellipse cx="-10" cy="60" rx="10" ry="5" fill="#553322" stroke="#333" strokeWidth="1.5" />
        <ellipse cx="10" cy="60" rx="10" ry="5" fill="#553322" stroke="#333" strokeWidth="1.5" />
      </g>
      {/* Left label */}
      <text x="160" y="580" textAnchor="middle" fill="#333" fontSize="14" fontWeight="700"
        style={{ textShadow: '0 0 4px rgba(255,255,255,0.8)' } as React.CSSProperties}>父</text>

      {/* ── Right character (blue shirt) ── */}
      <g transform="translate(640, 510) scale(-1,1)" filter="url(#tCharRough)">
        {/* Body */}
        <ellipse cx="0" cy="28" rx="22" ry="24" fill="#7799ff" stroke="#333" strokeWidth="2" />
        {/* Head */}
        <circle cx="0" cy="-10" r="22" fill="#ffe0b2" stroke="#333" strokeWidth="2" />
        {/* Hair */}
        <path d="M-22,-14 Q-17,-32 0,-34 Q17,-32 22,-14" fill="#333" stroke="#333" strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx="-7" cy="-12" r="2.5" fill="#222" />
        <circle cx="7" cy="-12" r="2.5" fill="#222" />
        <circle cx="-6" cy="-13" r="1" fill="white" />
        <circle cx="8" cy="-13" r="1" fill="white" />
        {/* Cheeks */}
        <ellipse cx="-14" cy="-4" rx="4" ry="3" fill="#ffaaaa" opacity="0.5" />
        <ellipse cx="14" cy="-4" rx="4" ry="3" fill="#ffaaaa" opacity="0.5" />
        {/* Mouth */}
        <path d="M-6,-5 Q0,0 6,-5" fill="none" stroke="#333" strokeWidth="1.5" />
        {/* Arms */}
        <line x1="-20" y1="22" x2="-36" y2="35" stroke="#ffe0b2" strokeWidth="6" strokeLinecap="round" />
        <line x1="-20" y1="22" x2="-36" y2="35" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="22" x2="36" y2="8" stroke="#ffe0b2" strokeWidth="6" strokeLinecap="round" />
        <line x1="20" y1="22" x2="36" y2="8" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        {/* Legs */}
        <ellipse cx="-10" cy="50" rx="9" ry="11" fill="#446688" stroke="#333" strokeWidth="1.5" />
        <ellipse cx="10" cy="50" rx="9" ry="11" fill="#446688" stroke="#333" strokeWidth="1.5" />
        {/* Shoes */}
        <ellipse cx="-10" cy="60" rx="10" ry="5" fill="#553322" stroke="#333" strokeWidth="1.5" />
        <ellipse cx="10" cy="60" rx="10" ry="5" fill="#553322" stroke="#333" strokeWidth="1.5" />
      </g>
      {/* Right label */}
      <text x="640" y="590" textAnchor="middle" fill="#333" fontSize="14" fontWeight="700"
        style={{ textShadow: '0 0 4px rgba(255,255,255,0.8)' } as React.CSSProperties}>息子</text>

      {/* ── Flying ball + text bubble ── */}
      <g filter="url(#tRough)">
        <circle cx="400" cy="400" r="14" fill="#f8f8f0" stroke="#333" strokeWidth="1.5" />
        <path d="M392,392 Q396,396 392,402" fill="none" stroke="#cc3333" strokeWidth="1.5" />
        <path d="M408,392 Q404,396 408,402" fill="none" stroke="#cc3333" strokeWidth="1.5" />
      </g>
      {/* Text bubble */}
      <rect x="330" y="415" width="140" height="30" rx="14" fill="rgba(255,255,255,0.9)" stroke="#bbb" strokeWidth="1.5" />
      <text x="400" y="435" textAnchor="middle" fill="#444" fontSize="12" fontWeight="600">最近元気してる？</text>

      {/* ── Grass tufts at bottom ── */}
      {[20, 80, 150, 220, 300, 380, 500, 570, 640, 720, 770].map((x, i) => (
        <g key={`tg-${i}`} filter="url(#tRough)">
          <path d={`M${x},${H} L${x-4},${H-22+i%3*5} L${x+2},${H}`} fill="#3a9a3a" />
          <path d={`M${x+5},${H} L${x+9},${H-28+i%4*5} L${x+14},${H}`} fill="#4aaa4a" />
        </g>
      ))}
    </svg>
  );
});

export default function TopPage() {
  const router = useRouter();
  const { createRoom, joinRoom, isConnected, error, clearError } = useGame();

  const [mode, setMode] = useState<'top' | 'create' | 'join'>('top');
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e: CustomEvent<{ roomId: string }>) => {
      router.push(`/room/${e.detail.roomId}?name=${encodeURIComponent(name)}`);
    };
    window.addEventListener('room-ready', handler as EventListener);
    return () => window.removeEventListener('room-ready', handler as EventListener);
  }, [name, router]);

  const handleCreate = () => {
    if (!name.trim()) return;
    setLoading(true);
    createRoom(name.trim());
  };

  const handleJoin = () => {
    if (!name.trim() || !roomCode.trim()) return;
    setLoading(true);
    joinRoom(roomCode.trim().toUpperCase(), name.trim());
    router.push(`/room/${roomCode.trim().toUpperCase()}?name=${encodeURIComponent(name.trim())}&joining=1`);
  };

  useEffect(() => {
    if (error) {
      setLoading(false);
      alert(error);
      clearError();
    }
  }, [error, clearError]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.key === 'Process') return;
    if (e.key === 'Enter') {
      if (mode === 'create') handleCreate();
      else if (mode === 'join') handleJoin();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">

      {/* ── Park background ── */}
      <TopPageScene />

      {/* ── Content overlay ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 pt-10 pb-8">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 style={{
            fontSize: 32,
            fontWeight: 800,
            color: 'white',
            textShadow: '3px 3px 0 rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.3)',
            letterSpacing: '0.05em',
            lineHeight: 1.3,
          }}>
            ひとこと
            <br />
            キャッチボール
          </h1>
          <p style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.85)',
            marginTop: 8,
            textShadow: '1px 1px 0 rgba(0,0,0,0.2)',
          }}>
            会話を続けてスコアを積み上げよう！
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="w-full max-w-xs" style={{ marginTop: 'auto', marginBottom: 40 }}>

          {mode === 'top' && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setMode('create')}
                className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all active:scale-95"
                style={{
                  background: '#e67e22',
                  border: '3px solid #d35400',
                  boxShadow: '3px 3px 0 rgba(0,0,0,0.15)',
                  fontSize: 16,
                }}
              >
                🏠 ルームを作る
              </button>
              <button
                onClick={() => setMode('join')}
                className="w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '3px solid #bbb',
                  color: '#555',
                  boxShadow: '3px 3px 0 rgba(0,0,0,0.1)',
                  fontSize: 16,
                }}
              >
                🚪 ルームに入る
              </button>
            </div>
          )}

          {mode === 'create' && (
            <div style={{
              background: 'rgba(255,255,255,0.92)',
              borderRadius: 20,
              padding: '24px 20px',
              border: '2px solid #ddd',
              boxShadow: '3px 3px 0 rgba(0,0,0,0.1)',
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#333', textAlign: 'center', marginBottom: 16 }}>
                ニックネームを入れてね
              </h2>
              <input
                type="text"
                placeholder="あなたの名前"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={12}
                className="w-full px-4 py-3 rounded-xl text-base mb-4 outline-none"
                style={{ background: '#f5f5f5', color: '#333', border: '2px solid #ddd', fontSize: 15 }}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button
                onClick={handleCreate}
                disabled={!name.trim() || loading || !isConnected}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-50"
                style={{ background: '#e67e22', border: '3px solid #d35400', boxShadow: '2px 2px 0 rgba(0,0,0,0.1)' }}
              >
                {loading ? '作成中...' : '⚾ ルームを作る'}
              </button>
              <button onClick={() => setMode('top')} className="w-full mt-3 py-2 text-sm" style={{ color: '#888' }}>
                ← 戻る
              </button>
            </div>
          )}

          {mode === 'join' && (
            <div style={{
              background: 'rgba(255,255,255,0.92)',
              borderRadius: 20,
              padding: '24px 20px',
              border: '2px solid #ddd',
              boxShadow: '3px 3px 0 rgba(0,0,0,0.1)',
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#333', textAlign: 'center', marginBottom: 16 }}>
                ルームに参加する
              </h2>
              <input
                type="text"
                placeholder="あなたの名前"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={12}
                className="w-full px-4 py-3 rounded-xl text-base mb-3 outline-none"
                style={{ background: '#f5f5f5', color: '#333', border: '2px solid #ddd', fontSize: 15 }}
                autoFocus
              />
              <input
                type="text"
                placeholder="ルームコード (例: AB12CD)"
                value={roomCode}
                onChange={e => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl text-base mb-4 outline-none font-mono"
                style={{ background: '#f5f5f5', color: '#333', border: '2px solid #ddd', fontSize: 15, letterSpacing: 2 }}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleJoin}
                disabled={!name.trim() || !roomCode.trim() || loading || !isConnected}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-50"
                style={{ background: '#e67e22', border: '3px solid #d35400', boxShadow: '2px 2px 0 rgba(0,0,0,0.1)' }}
              >
                {loading ? '参加中...' : '🚪 参加する'}
              </button>
              <button onClick={() => setMode('top')} className="w-full mt-3 py-2 text-sm" style={{ color: '#888' }}>
                ← 戻る
              </button>
            </div>
          )}
        </div>

        {/* Connection status */}
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`} />
          {isConnected ? 'サーバー接続済み' : '接続中...'}
        </div>
      </div>
    </div>
  );
}
