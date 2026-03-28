'use client';

import { useState, useRef, KeyboardEvent } from 'react';

export function ChatInput({ onSend, isStreaming, autoFocus = false }: {
  onSend: (message: string) => void;
  isStreaming: boolean;
  autoFocus?: boolean;
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = '40px';
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 bg-[#F5F0EA] border border-[#275C53]/15 rounded-2xl p-2 focus-within:border-[#275C53]/40 focus-within:shadow-[0_0_12px_rgba(39,92,83,0.1)] transition-all">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about strains, growing tips..."
        autoFocus={autoFocus}
        rows={1}
        className="flex-1 bg-transparent text-[#192026] placeholder:text-[#192026]/30 resize-none outline-none px-3 py-2 text-sm max-h-32 min-h-[40px]"
        style={{ height: '40px' }}
        onInput={(e) => {
          const t = e.target as HTMLTextAreaElement;
          t.style.height = 'auto';
          t.style.height = Math.min(t.scrollHeight, 128) + 'px';
        }}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || isStreaming}
        className="shrink-0 w-10 h-10 rounded-xl bg-[#275C53] hover:bg-[#1e4a42] disabled:bg-[#275C53]/30 disabled:opacity-50 flex items-center justify-center transition-all cursor-pointer"
        aria-label="Send message"
      >
        {isStreaming ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )}
      </button>
    </div>
  );
}
