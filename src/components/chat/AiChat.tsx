'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '@/hooks/useChat';
import { ChatInput } from './ChatInput';
import { ChatSuggestions } from './ChatSuggestions';
import { ChatProductCard } from './ChatProductCard';
import type { Product } from '@/lib/products/types';

const productCache = new Map<string, Product>();

function parseProducts(text: string): string[] {
  const match = text.match(/<products>\s*(\[[\s\S]*?\])\s*<\/products>/);
  if (!match) return [];
  try { return JSON.parse(match[1]); } catch { return []; }
}

function cleanText(text: string): string {
  return text
    .replace(/<products>[\s\S]*?<\/products>/g, '')
    .replace(/<cart_action>[\s\S]*?<\/cart_action>/g, '')
    .replace(/<nav_action>[\s\S]*?<\/nav_action>/g, '')
    .trim();
}

function MessageBubble({ role, content, isStreaming }: { role: string; content: string; isStreaming?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const clean = cleanText(content);
  const slugs = parseProducts(content);

  useEffect(() => {
    if (slugs.length === 0) return;
    let cancelled = false;
    (async () => {
      const fetched: Product[] = [];
      for (const slug of slugs) {
        if (productCache.has(slug)) {
          fetched.push(productCache.get(slug)!);
          continue;
        }
        try {
          const res = await fetch(`/api/products/by-slug?slug=${encodeURIComponent(slug)}`);
          if (res.ok) {
            const p = await res.json();
            if (p) { productCache.set(slug, p); fetched.push(p); }
          }
        } catch { /* skip */ }
      }
      if (!cancelled) setProducts(fetched);
    })();
    return () => { cancelled = true; };
  }, [content]);

  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-[#275C53] text-white rounded-2xl rounded-br-md px-3.5 py-2.5 max-w-[85%] text-sm">{clean}</div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-full bg-[#275C53] flex items-center justify-center shrink-0 text-[10px] font-bold text-white" style={{ fontFamily: 'var(--font-patua)' }}>RK</div>
      <div className="space-y-2 min-w-0 flex-1">
        <div className="prose prose-sm max-w-none text-[#192026] prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-[#275C53] text-[13px] leading-relaxed">
          <ReactMarkdown>{clean || (isStreaming ? '...' : '')}</ReactMarkdown>
          {isStreaming && clean && <span className="animate-pulse text-[#275C53]">|</span>}
        </div>
        {products.length > 0 && (
          <div className="space-y-1.5 mt-2">
            {products.map((p, i) => <ChatProductCard key={p.slug} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export function AiChat() {
  const { messages, isStreaming, isOpen, sendMessage, toggleChat, setChatOpen, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = useCallback((msg: string) => {
    sendMessage(msg);
  }, [sendMessage]);

  return (
    <>
      {/* Toggle button — bottom left */}
      <button
        onClick={toggleChat}
        className={`fixed left-4 bottom-4 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all cursor-pointer ${
          isOpen
            ? 'bg-[#192026] hover:bg-[#192026]/90 scale-90'
            : 'bg-[#275C53] hover:bg-[#1e4a42] hover:scale-105'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open AI chat'}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" fill="white" />
            <circle cx="12" cy="10" r="1" fill="white" />
            <circle cx="15" cy="10" r="1" fill="white" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed left-4 bottom-20 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[min(70vh,560px)] bg-white border border-[#275C53]/15 rounded-2xl flex flex-col overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#275C53]/10 bg-[#275C53]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white" style={{ fontFamily: 'var(--font-patua)' }}>RK</div>
              <div>
                <h3 className="text-sm font-semibold text-white">Royal King Seeds AI</h3>
                <p className="text-[10px] text-white/60">Strain expert & grow advisor</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button onClick={clearMessages} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer" aria-label="New conversation" title="New conversation">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                </button>
              )}
              <button onClick={() => setChatOpen(false)} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer" aria-label="Close chat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#F5F0EA]/50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-4">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-xl bg-[#275C53]/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#275C53]" style={{ fontFamily: 'var(--font-patua)' }}>How can I help?</h2>
                  <p className="text-[#192026]/40 text-xs max-w-[260px]">
                    I can recommend strains, give growing tips, compare products, and add items to your cart.
                  </p>
                </div>
                <ChatSuggestions onSelect={handleSend} />
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <MessageBubble
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-[#275C53]/10 bg-white">
            <ChatInput onSend={handleSend} isStreaming={isStreaming} autoFocus />
            <p className="text-[9px] text-[#192026]/20 text-center mt-1.5">AI can recommend strains, compare products & add to cart</p>
          </div>
        </div>
      )}
    </>
  );
}
