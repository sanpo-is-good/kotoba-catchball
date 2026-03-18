'use client';

import { useState, useRef } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.key === 'Process') return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = !!text.trim() && !disabled;

  return (
    <div className="flex-shrink-0 safe-bottom"
      style={{
        background: '#4a9e4a',
        borderTop: '3px solid #2d7a2d',
        padding: '8px 10px',
      }}>
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ひとことを投げよう..."
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none outline-none disabled:opacity-40"
          style={{
            background: 'rgba(255,255,255,0.9)',
            color: '#333',
            border: '2px solid #2d7a2d',
            borderRadius: 12,
            padding: '8px 14px',
            fontSize: 14,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif',
            maxHeight: 80,
            lineHeight: '1.5',
            caretColor: '#333',
          }}
          onInput={e => {
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = Math.min(el.scrollHeight, 80) + 'px';
          }}
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: canSend ? '#e67e22' : 'rgba(255,255,255,0.3)',
            color: canSend ? 'white' : 'rgba(255,255,255,0.5)',
            border: canSend ? '2px solid #d35400' : '2px solid rgba(0,0,0,0.1)',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: canSend ? 'pointer' : 'default',
            transition: 'all 0.15s',
            flexShrink: 0,
            boxShadow: canSend ? '2px 2px 0 rgba(0,0,0,0.15)' : 'none',
          }}
        >
          ⚾
        </button>
      </div>
    </div>
  );
}
