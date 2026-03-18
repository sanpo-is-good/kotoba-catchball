'use client';

import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message, PitchType } from '@/lib/types';

const PITCH_LABEL: Record<PitchType, { emoji: string; label: string; color: string }> = {
  straight: { emoji: '⚡', label: 'ストレート', color: '#e04030' },
  lob:      { emoji: '🎾', label: 'ロブ',       color: '#60a020' },
  spin:     { emoji: '🌀', label: 'スピン',     color: '#8855cc' },
  curve:    { emoji: '💫', label: 'カーブ',     color: '#3388cc' },
  golden:   { emoji: '⭐', label: 'ゴールデン', color: '#cc8800' },
};

// ─────────────────────────────────────────
// Park scene SVG background (hand-drawn crayon style)
// ─────────────────────────────────────────
const ParkScene = memo(function ParkScene() {
  const W = 800, H = 500;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%" height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="crayon" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="crayonSoft" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="rough" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="8" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* ── Sky ── */}
      <rect x="0" y="0" width={W} height="300" fill="#62b6ff" filter="url(#crayonSoft)" />
      <rect x="0" y="0" width={W} height="120" fill="#8ad0ff" opacity="0.5" filter="url(#crayonSoft)" />

      {/* ── Clouds ── */}
      <ellipse cx="150" cy="70" rx="65" ry="28" fill="white" opacity="0.85" filter="url(#crayon)" />
      <ellipse cx="180" cy="60" rx="45" ry="22" fill="white" opacity="0.8" filter="url(#crayon)" />
      <ellipse cx="550" cy="90" rx="55" ry="24" fill="white" opacity="0.82" filter="url(#crayon)" />
      <ellipse cx="580" cy="80" rx="40" ry="20" fill="white" opacity="0.78" filter="url(#crayon)" />
      <ellipse cx="700" cy="50" rx="35" ry="16" fill="white" opacity="0.7" filter="url(#crayon)" />

      {/* ── Far trees / treeline ── */}
      {/* Tree 1 (left) */}
      <rect x="60" y="210" width="12" height="40" fill="#6b4423" filter="url(#rough)" />
      <ellipse cx="66" cy="200" rx="35" ry="35" fill="#2d8a30" filter="url(#crayon)" />
      <ellipse cx="55" cy="195" rx="22" ry="22" fill="#3aaa3e" filter="url(#crayon)" />
      <ellipse cx="78" cy="192" rx="20" ry="20" fill="#35993a" filter="url(#crayon)" />

      {/* Tree 2 (center-left) */}
      <rect x="250" y="215" width="10" height="35" fill="#6b4423" filter="url(#rough)" />
      <ellipse cx="255" cy="205" rx="30" ry="30" fill="#2d8a30" filter="url(#crayon)" />
      <ellipse cx="245" cy="200" rx="20" ry="18" fill="#3aaa3e" filter="url(#crayon)" />

      {/* Tree 3 (center-right) */}
      <rect x="520" y="212" width="11" height="38" fill="#6b4423" filter="url(#rough)" />
      <ellipse cx="525" cy="200" rx="33" ry="33" fill="#2d8a30" filter="url(#crayon)" />
      <ellipse cx="536" cy="195" rx="22" ry="22" fill="#35993a" filter="url(#crayon)" />

      {/* Tree 4 (right) */}
      <rect x="700" y="218" width="10" height="32" fill="#6b4423" filter="url(#rough)" />
      <ellipse cx="705" cy="210" rx="28" ry="28" fill="#2d8a30" filter="url(#crayon)" />
      <ellipse cx="715" cy="205" rx="18" ry="16" fill="#3aaa3e" filter="url(#crayon)" />

      {/* ── Ground / park grass ── */}
      <path d={`M0,260 Q200,250 400,258 Q600,252 ${W},260 L${W},${H} L0,${H} Z`}
        fill="#5cb85c" filter="url(#crayon)" />
      {/* Lighter grass patch */}
      <path d={`M0,270 Q200,265 400,273 Q600,267 ${W},272 L${W},${H} L0,${H} Z`}
        fill="#6ccc6c" opacity="0.5" filter="url(#crayon)" />

      {/* ── Park path (dirt walkway) ── */}
      <path d={`M250,${H} Q300,380 350,340 Q400,310 450,340 Q500,380 550,${H}`}
        fill="#d4a96a" filter="url(#crayon)" />
      <path d={`M270,${H} Q310,390 360,350 Q400,325 440,350 Q490,390 530,${H}`}
        fill="#c89b5a" opacity="0.5" filter="url(#crayon)" />

      {/* ── Park bench ── */}
      <rect x="370" y="310" width="60" height="6" fill="#8B5E3C" rx="1" filter="url(#rough)" />
      <rect x="370" y="320" width="60" height="6" fill="#7a5230" rx="1" filter="url(#rough)" />
      <rect x="378" y="326" width="4" height="18" fill="#5a3a1a" filter="url(#rough)" />
      <rect x="418" y="326" width="4" height="18" fill="#5a3a1a" filter="url(#rough)" />


      {/* ── Grass tufts at bottom ── */}
      {[20, 70, 130, 200, 280, 360, 440, 510, 580, 650, 720, 770].map((x, i) => (
        <g key={`g-${i}`} filter="url(#rough)">
          <path d={`M${x},${H} L${x-4},${H-22+i%3*5} L${x+2},${H}`} fill="#3a9a3a" />
          <path d={`M${x+5},${H} L${x+9},${H-28+i%4*5} L${x+14},${H}`} fill="#4aaa4a" />
          <path d={`M${x+12},${H} L${x+17},${H-18+i%2*8} L${x+22},${H}`} fill="#3a9a3a" />
        </g>
      ))}
    </svg>
  );
});

// ─────────────────────────────────────────
// Cute character (round body, not stick figure)
// ─────────────────────────────────────────
function CuteCharacter({ side, state }: { side: 'left' | 'right'; state: 'idle' | 'throw' | 'catch' }) {
  const isRight = side === 'right';
  // Arm positions based on state
  const throwArmAngle = state === 'throw' ? -70 : state === 'catch' ? 50 : 20;
  const otherArmAngle = 30;

  return (
    <svg viewBox="0 0 80 110" width="60" height="82"
      style={{ overflow: 'visible', transform: isRight ? 'scaleX(-1)' : undefined }}>
      <defs>
        <filter id={`charRough-${side}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="turbulence" baseFrequency="0.06" numOctaves="2" seed={side === 'left' ? 3 : 9} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#charRough-${side})`}>
        {/* Body (round) */}
        <ellipse cx="40" cy="72" rx="20" ry="22"
          fill={side === 'left' ? '#ff7777' : '#7799ff'}
          stroke="#333" strokeWidth="2" />

        {/* Head */}
        <circle cx="40" cy="32" r="20" fill="#ffe0b2" stroke="#333" strokeWidth="2" />

        {/* Hair */}
        <path d={`M20,28 Q25,10 40,12 Q55,10 60,28`}
          fill={side === 'left' ? '#5a3825' : '#333'}
          stroke="#333" strokeWidth="1.5" />

        {/* Eyes */}
        <circle cx="33" cy="30" r="2.5" fill="#222" />
        <circle cx="47" cy="30" r="2.5" fill="#222" />
        {/* Eye shine */}
        <circle cx="34" cy="29" r="1" fill="white" />
        <circle cx="48" cy="29" r="1" fill="white" />

        {/* Cheeks */}
        <ellipse cx="26" cy="36" rx="4" ry="3" fill="#ffaaaa" opacity="0.5" />
        <ellipse cx="54" cy="36" rx="4" ry="3" fill="#ffaaaa" opacity="0.5" />

        {/* Mouth */}
        {state === 'catch' ? (
          <ellipse cx="40" cy="38" rx="3" ry="4" fill="none" stroke="#333" strokeWidth="1.5" />
        ) : state === 'throw' ? (
          <path d="M34,37 Q40,35 46,37" fill="none" stroke="#333" strokeWidth="1.5" />
        ) : (
          <path d="M34,37 Q40,42 46,37" fill="none" stroke="#333" strokeWidth="1.5" />
        )}

        {/* Left arm */}
        <line x1="22" y1="65"
          x2={22 - 16 * Math.cos((otherArmAngle * Math.PI) / 180)}
          y2={65 + 16 * Math.sin((otherArmAngle * Math.PI) / 180)}
          stroke="#ffe0b2" strokeWidth="6" strokeLinecap="round" />
        <line x1="22" y1="65"
          x2={22 - 16 * Math.cos((otherArmAngle * Math.PI) / 180)}
          y2={65 + 16 * Math.sin((otherArmAngle * Math.PI) / 180)}
          stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Right arm (throwing/catching) */}
        <line x1="58" y1="65"
          x2={58 + 18 * Math.cos((throwArmAngle * Math.PI) / 180)}
          y2={65 + 18 * Math.sin((throwArmAngle * Math.PI) / 180)}
          stroke="#ffe0b2" strokeWidth="6" strokeLinecap="round" />
        <line x1="58" y1="65"
          x2={58 + 18 * Math.cos((throwArmAngle * Math.PI) / 180)}
          y2={65 + 18 * Math.sin((throwArmAngle * Math.PI) / 180)}
          stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Legs */}
        <ellipse cx="32" cy="92" rx="8" ry="10" fill={side === 'left' ? '#4466aa' : '#446688'} stroke="#333" strokeWidth="1.5" />
        <ellipse cx="48" cy="92" rx="8" ry="10" fill={side === 'left' ? '#4466aa' : '#446688'} stroke="#333" strokeWidth="1.5" />

        {/* Shoes */}
        <ellipse cx="32" cy="102" rx="9" ry="5" fill="#553322" stroke="#333" strokeWidth="1.5" />
        <ellipse cx="48" cy="102" rx="9" ry="5" fill="#553322" stroke="#333" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────
// Hand-drawn baseball
// ─────────────────────────────────────────
function HandDrawnBall({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 30 30" width={size} height={size} style={{ overflow: 'visible' }}>
      <defs>
        <filter id="ballRough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="turbulence" baseFrequency="0.06" numOctaves="2" seed="12" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter="url(#ballRough)">
        <circle cx="15" cy="15" r="12" fill="#f8f8f0" stroke="#333" strokeWidth="1.5" />
        <path d="M8,8 Q12,12 8,18" fill="none" stroke="#cc3333" strokeWidth="1.5" />
        <path d="M22,8 Q18,12 22,18" fill="none" stroke="#cc3333" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────
// Main GameField
// ─────────────────────────────────────────
interface Props {
  messages: Message[];
  socketId: string | null;
  myName: string;
  opponentName: string;
}

// Character positions as percentages
const LEFT_X = 15;   // left character center %
const RIGHT_X = 85;  // right character center %
const CHAR_BOTTOM = 14; // bottom %

export default function GameField({ messages, socketId, myName, opponentName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ballHolder, setBallHolder] = useState<'left' | 'right' | null>(null);
  const [throwing, setThrowing] = useState(false);
  const [throwDir, setThrowDir] = useState<'right-to-left' | 'left-to-right'>('right-to-left');
  const [leftState, setLeftState] = useState<'idle' | 'throw' | 'catch'>('idle');
  const [rightState, setRightState] = useState<'idle' | 'throw' | 'catch'>('idle');
  const [lastPitch, setLastPitch] = useState<PitchType | null>(null);
  const [lastText, setLastText] = useState<string | null>(null);
  const [scorePop, setScorePop] = useState<{ text: string; side: 'left' | 'right' } | null>(null);
  const [pitchLabel, setPitchLabel] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  // Calculate pixel distance between characters
  const getThrowDistance = useCallback(() => {
    if (!containerRef.current) return 300;
    const w = containerRef.current.offsetWidth;
    return w * (RIGHT_X - LEFT_X) / 100;
  }, []);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const t = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
    };

    const isMine = last.playerId === socketId;
    const dir: 'right-to-left' | 'left-to-right' = isMine ? 'right-to-left' : 'left-to-right';
    const throwerSide = isMine ? 'right' : 'left';
    const catcherSide: 'left' | 'right' = isMine ? 'left' : 'right';
    const pt = last.judgeResult.pitchType;
    const totalScore = last.judgeResult.scoreDelta + last.bonusScore;
    const pitchInfo = PITCH_LABEL[pt];

    setThrowDir(dir);
    setLastPitch(pt);
    setLastText(last.text);
    setBallHolder(null);

    // Thrower winds up
    if (throwerSide === 'right') setRightState('throw');
    else setLeftState('throw');

    // Release
    t(() => {
      setThrowing(true);
      setPitchLabel(`${pitchInfo.emoji} ${pitchInfo.label}!`);
    }, 200);

    // Ball arrives at catcher
    t(() => {
      setThrowing(false);
      setBallHolder(catcherSide);
      if (catcherSide === 'left') setLeftState('catch');
      else setRightState('catch');
      setScorePop({ text: `+${totalScore}`, side: catcherSide });
    }, 1600);

    // Reset thrower
    t(() => {
      if (throwerSide === 'right') setRightState('idle');
      else setLeftState('idle');
      setPitchLabel(null);
    }, 1900);

    // Reset catcher
    t(() => {
      if (catcherSide === 'left') setLeftState('idle');
      else setRightState('idle');
      setScorePop(null);
      setLastText(null);
    }, 2800);
  }, [messages, socketId, getThrowDistance]);

  // The travel distance in pixels — calculated from container width
  const dist = getThrowDistance();

  return (
    <div ref={containerRef} className="relative flex-1 overflow-hidden" style={{ minHeight: 0 }}>

      {/* ── Park background ── */}
      <ParkScene />

      {/* ── Left character (opponent) ── */}
      <div className="absolute flex flex-col items-center"
        style={{ left: `${LEFT_X}%`, bottom: `${CHAR_BOTTOM}%`, transform: 'translateX(-50%)', zIndex: 10 }}>
        <motion.div
          animate={leftState === 'idle' ? { y: [0, -3, 0] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CuteCharacter side="left" state={leftState} />
        </motion.div>

        {/* Ball held */}
        <AnimatePresence>
          {ballHolder === 'left' && !throwing && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, y: [0, -5, 0] }}
              exit={{ scale: 0 }}
              transition={{ y: { duration: 1.2, repeat: Infinity } }}
              style={{ position: 'absolute', top: -8, right: -16 }}
            >
              <HandDrawnBall size={22} />
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{
          marginTop: 2, fontSize: 12, fontWeight: 700, color: '#333',
          textShadow: '0 0 6px rgba(255,255,255,0.9)',
          maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{opponentName}</div>
      </div>

      {/* ── Right character (me) ── */}
      <div className="absolute flex flex-col items-center"
        style={{ left: `${RIGHT_X}%`, bottom: `${CHAR_BOTTOM}%`, transform: 'translateX(-50%)', zIndex: 10 }}>
        <motion.div
          animate={rightState === 'idle' ? { y: [0, -3, 0] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <CuteCharacter side="right" state={rightState} />
        </motion.div>

        {/* Ball held */}
        <AnimatePresence>
          {ballHolder === 'right' && !throwing && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, y: [0, -5, 0] }}
              exit={{ scale: 0 }}
              transition={{ y: { duration: 1.2, repeat: Infinity } }}
              style={{ position: 'absolute', top: -8, left: -16 }}
            >
              <HandDrawnBall size={22} />
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{
          marginTop: 2, fontSize: 12, fontWeight: 700, color: '#333',
          textShadow: '0 0 6px rgba(255,255,255,0.9)',
          maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{myName}</div>
      </div>

      {/* ── Flying ball + text ── */}
      <AnimatePresence>
        {throwing && (
          <motion.div
            key={`ball-${messages.length}`}
            style={{
              position: 'absolute',
              left: throwDir === 'right-to-left' ? `${RIGHT_X}%` : `${LEFT_X}%`,
              bottom: `${CHAR_BOTTOM + 18}%`,
              zIndex: 25,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: throwDir === 'right-to-left'
                ? [0, -dist * 0.5, -dist]
                : [0, dist * 0.5, dist],
              y: [0, -100, 5],
              opacity: [0, 1, 1],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, ease: 'easeInOut', opacity: { times: [0, 0.08, 1] } }}
          >
            {/* Ball */}
            <motion.div
              animate={{ rotate: throwDir === 'right-to-left' ? [0, -540] : [0, 540] }}
              transition={{ duration: 1.3, ease: 'linear' }}
            >
              <HandDrawnBall size={30} />
            </motion.div>
            {/* Text bubble attached to ball */}
            {lastText && (
              <div style={{
                marginTop: 6,
                background: 'rgba(255,255,255,0.92)',
                color: '#333',
                padding: '4px 12px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                maxWidth: 180,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                border: '1.5px solid #bbb',
                boxShadow: '1px 2px 0 rgba(0,0,0,0.1)',
                textAlign: 'center',
              }}>
                {lastText.length > 15 ? lastText.slice(0, 15) + '…' : lastText}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pitch label ── */}
      <AnimatePresence>
        {pitchLabel && (
          <motion.div
            key={`pitch-${messages.length}`}
            style={{ position: 'absolute', left: '50%', top: '8%', transform: 'translateX(-50%)', zIndex: 30 }}
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <div style={{
              background: lastPitch ? PITCH_LABEL[lastPitch].color : '#333',
              color: 'white', padding: '5px 16px', borderRadius: 16,
              fontSize: 14, fontWeight: 700,
              border: '2px solid rgba(0,0,0,0.15)',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.12)',
            }}>
              {pitchLabel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Score popup ── */}
      <AnimatePresence>
        {scorePop && (
          <motion.div
            key={`score-${messages.length}`}
            style={{
              position: 'absolute',
              left: scorePop.side === 'left' ? `${LEFT_X}%` : `${RIGHT_X}%`,
              bottom: '50%', zIndex: 30,
              transform: 'translateX(-50%)',
            }}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: [0, -20, -40, -60], scale: [0.5, 1.3, 1, 0.8] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <span style={{
              fontSize: 20, fontWeight: 800, color: '#cc8800',
              textShadow: '1px 1px 0 rgba(0,0,0,0.25), 0 0 10px rgba(255,200,0,0.4)',
            }}>
              {scorePop.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Catch effect ── */}
      <AnimatePresence>
        {ballHolder && !throwing && scorePop && (
          <motion.div
            key={`catch-${messages.length}`}
            style={{
              position: 'absolute',
              left: ballHolder === 'left' ? `${LEFT_X}%` : `${RIGHT_X}%`,
              bottom: `${CHAR_BOTTOM + 15}%`,
              transform: 'translateX(-50%)',
              fontSize: 36,
              zIndex: 28,
              pointerEvents: 'none',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1.3, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 0.4 }}
          >
            💥
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Idle prompt ── */}
      {messages.length === 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ pointerEvents: 'none', zIndex: 5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div style={{
            background: 'rgba(255,255,255,0.88)', color: '#444',
            padding: '10px 22px', borderRadius: 18,
            fontSize: 15, fontWeight: 600,
            border: '2px solid #aaa',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.08)',
          }}>
            ⚾ ひとことを投げよう！
          </div>
        </motion.div>
      )}
    </div>
  );
}
