'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const GOAL = 300;

interface Props {
  score: number;
  rally: number;
  opponentName: string;
  myName: string;
}

export default function GameHUD({ score, rally, opponentName, myName }: Props) {
  const prev = useRef(score);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (score !== prev.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 400);
      prev.current = score;
      return () => clearTimeout(t);
    }
  }, [score]);

  const progress = Math.min((score / GOAL) * 100, 100);

  const comboLabel =
    rally >= 10 ? '🔥 MAX COMBO!!' :
    rally >= 5  ? '🔥 GREAT!' :
    rally >= 3  ? '✨ NICE!'  : null;

  return (
    <div className="flex-shrink-0 safe-top"
      style={{
        background: '#4a9e4a',
        borderBottom: '3px solid #2d7a2d',
        padding: '6px 12px 8px',
        fontFamily: 'sans-serif',
      }}>

      {/* Top row */}
      <div className="flex items-center justify-between">
        {/* Left player */}
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 11, color: '#fff', fontWeight: 700, textShadow: '1px 1px 0 rgba(0,0,0,0.2)' }}>
            {opponentName}
          </span>
        </div>

        {/* Score center */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>SCORE</span>
          <motion.span
            key={score}
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: flash ? '#fff' : '#ffee44',
              textShadow: '2px 2px 0 rgba(0,0,0,0.25)',
            }}
            animate={{ scale: flash ? [1, 1.25, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {score}
          </motion.span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>/ {GOAL}</span>
        </div>

        {/* Right player */}
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 11, color: '#fff', fontWeight: 700, textShadow: '1px 1px 0 rgba(0,0,0,0.2)' }}>
            {myName}
          </span>
        </div>
      </div>

      {/* Progress + rally row */}
      <div className="flex items-center gap-2 mt-1.5">
        {/* Progress bar */}
        <div className="flex-1" style={{
          height: 8,
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 4,
          border: '1px solid rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}>
          <motion.div
            style={{
              height: '100%',
              borderRadius: 3,
              background: progress < 60
                ? '#ffee44'
                : progress < 85
                ? '#ffaa22'
                : '#ff5533',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', flexShrink: 0 }}>
          Rally <b style={{ color: '#ffee44' }}>{rally}</b>
        </span>

        {comboLabel && (
          <motion.span
            key={comboLabel}
            style={{ fontSize: 11, fontWeight: 700, color: '#ffee44', flexShrink: 0 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {comboLabel}
          </motion.span>
        )}
      </div>
    </div>
  );
}
