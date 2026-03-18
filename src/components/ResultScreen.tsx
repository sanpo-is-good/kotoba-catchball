'use client';

import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { motion } from 'framer-motion';

const PITCH_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  straight: { label: '⚡ ストレート', bg: 'rgba(255,255,255,0.1)',  text: '#f0e6ff' },
  lob:      { label: '🎾 ロブ',       bg: 'rgba(163,230,53,0.2)',   text: '#a3e635' },
  spin:     { label: '🌀 スピン',     bg: 'rgba(192,132,252,0.2)',  text: '#c084fc' },
  curve:    { label: '💫 カーブ',     bg: 'rgba(96,165,250,0.2)',   text: '#60a5fa' },
  golden:   { label: '⭐ ゴールデン', bg: 'rgba(251,191,36,0.2)',   text: '#fbbf24' },
};

function formatTime(ts: number) {
  const d = new Date(ts);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export default function ResultScreen() {
  const { room, messages, socketId } = useGame();
  const router = useRouter();

  const score = room?.score ?? 0;
  const rally = room?.rally ?? 0;

  const pitchCounts = messages.reduce((acc, m) => {
    const pt = m.judgeResult.pitchType;
    acc[pt] = (acc[pt] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPitch = Object.entries(pitchCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: '#050114' }}>

      {/* ── Result header ── */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 safe-top text-center"
        style={{ background: 'rgba(5,1,20,0.95)', borderBottom: '1px solid rgba(124,58,237,0.25)' }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
        >
          <div className="text-4xl mb-1">🎉</div>
          <h1 className="text-xl font-bold" style={{ color: '#fbbf24' }}>ゲームクリア！</h1>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>よく続いたね！</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex justify-center gap-6 mt-3"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs" style={{ color: '#6b7280' }}>スコア</span>
            <span className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{score}</span>
          </div>
          <div className="w-px" style={{ background: 'rgba(124,58,237,0.3)' }} />
          <div className="flex flex-col items-center">
            <span className="text-xs" style={{ color: '#6b7280' }}>ラリー</span>
            <span className="text-2xl font-bold" style={{ color: '#a855f7' }}>{rally}</span>
          </div>
          {topPitch && (
            <>
              <div className="w-px" style={{ background: 'rgba(124,58,237,0.3)' }} />
              <div className="flex flex-col items-center">
                <span className="text-xs" style={{ color: '#6b7280' }}>多かった球</span>
                <span className="text-sm font-bold" style={{ color: '#f0e6ff' }}>
                  {PITCH_BADGE[topPitch[0]]?.label ?? topPitch[0]}
                </span>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* ── Chat log (LINE style) ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3"
        style={{ background: '#0d0826' }}>

        {/* Date chip */}
        <div className="flex justify-center">
          <span className="text-xs px-3 py-1 rounded-full"
            style={{ background: 'rgba(124,58,237,0.15)', color: '#6b7280' }}>
            会話のきろく
          </span>
        </div>

        {messages.map((msg, i) => {
          const isMe   = msg.playerId === socketId;
          const badge  = PITCH_BADGE[msg.judgeResult.pitchType];
          const showName = i === 0 || messages[i - 1].playerId !== msg.playerId;

          return (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              {/* Sender name (shown only on first consecutive message) */}
              {showName && !isMe && (
                <span className="text-xs mb-1 ml-1" style={{ color: '#fca5a5' }}>
                  {msg.playerName}
                </span>
              )}

              <div className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                {/* Bubble */}
                <div className={isMe ? 'result-bubble-mine' : 'result-bubble-theirs'}>
                  {msg.text}
                </div>

                {/* Time */}
                <span className="text-xs flex-shrink-0" style={{ color: '#374151' }}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>

              {/* Pitch badge + score */}
              <div className={`flex items-center gap-1.5 mt-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: badge?.bg, color: badge?.text }}>
                  {badge?.label}
                </span>
                <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>
                  +{msg.judgeResult.scoreDelta + msg.bonusScore}
                </span>
                {msg.bonusScore > 0 && (
                  <span className="text-xs" style={{ color: '#4ade80' }}>コンボ!</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Play again button ── */}
      <div className="flex-shrink-0 px-4 py-3 safe-bottom"
        style={{ background: 'rgba(5,1,20,0.95)', borderTop: '1px solid rgba(124,58,237,0.2)' }}>
        <button
          onClick={() => router.push('/')}
          className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
            boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
          }}
        >
          🔄 もう一度遊ぶ
        </button>
      </div>
    </div>
  );
}
