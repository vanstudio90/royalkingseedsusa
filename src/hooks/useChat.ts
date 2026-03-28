'use client';

import { useCallback } from 'react';
import { useAiChatStore } from '@/stores/ai-chat-store';
import { useCartStore } from '@/stores/cart-store';
import type { ChatMessage } from '@/types/chat';

async function fetchProductBySlug(slug: string) {
  try {
    const res = await fetch(`/api/products/by-slug?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export function useChat() {
  const {
    messages, isStreaming, addMessage, updateLastAssistantMessage,
    setStreaming, isOpen, setChatOpen, toggleChat, clearMessages,
  } = useAiChatStore();

  const addItem = useCartStore((s) => s.addItem);

  const sendMessage = useCallback(
    async (content: string) => {
      if (isStreaming) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(), role: 'user', content, timestamp: Date.now(),
      };
      addMessage(userMessage);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(), role: 'assistant', content: '', timestamp: Date.now(),
      };
      addMessage(assistantMessage);
      setStreaming(true);

      try {
        const chatHistory = [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user' as const, content },
        ];

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: chatHistory }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Chat request failed (${response.status})`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response stream');

        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  updateLastAssistantMessage(fullText);
                }
              } catch { /* skip malformed */ }
            }
          }
        }

        parseAndHandleActions(fullText);
      } catch (error) {
        console.error('Chat error:', error);
        const msg = error instanceof Error ? error.message : 'Unknown error';
        updateLastAssistantMessage(
          msg.includes('API_KEY') || msg.includes('not configured')
            ? 'Chat is temporarily unavailable. Please try again later.'
            : `Sorry, I encountered an error. Please try again.`
        );
      } finally {
        setStreaming(false);
      }
    },
    [messages, isStreaming, addMessage, updateLastAssistantMessage, setStreaming]
  );

  const parseAndHandleActions = useCallback(
    async (text: string) => {
      const cartMatches = text.matchAll(/<cart_action>([\s\S]*?)<\/cart_action>/g);
      for (const match of cartMatches) {
        try {
          const action = JSON.parse(match[1]);
          if (action.action === 'add') {
            const product = await fetchProductBySlug(action.slug);
            if (product) addItem(product, action.quantity || 1);
          }
        } catch { /* ignore */ }
      }

      const navMatch = text.match(/<nav_action>([\s\S]*?)<\/nav_action>/);
      if (navMatch) {
        try {
          const nav = JSON.parse(navMatch[1]);
          if (nav.action === 'checkout' || nav.action === 'show_cart') {
            window.location.href = '/checkout';
          }
        } catch { /* ignore */ }
      }

      // Handle order lookup actions
      const orderMatch = text.match(/<order_lookup>([\s\S]*?)<\/order_lookup>/);
      if (orderMatch) {
        try {
          const lookup = JSON.parse(orderMatch[1]);
          if (lookup.order_number && lookup.email) {
            const res = await fetch('/api/orders/lookup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order_number: lookup.order_number, email: lookup.email }),
            });
            const data = await res.json();
            if (res.ok) {
              const items = (data.items || []).map((i: any) => `${i.name} x${i.quantity}`).join(', ');
              const tracking = data.tracking_number
                ? `**Tracking:** ${data.tracking_number}`
                : '**Tracking:** Not yet available';
              const orderInfo = [
                `Here's what I found for order **${data.order_number}**:`,
                '',
                `**Status:** ${data.status}`,
                `**Payment:** ${data.payment_status}`,
                tracking,
                `**Items:** ${items || 'N/A'}`,
                `**Total:** $${data.total}`,
                `**Placed:** ${new Date(data.placed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
                '',
                'Is there anything else I can help you with?',
              ].join('\n');
              // Append order info to the existing message
              const currentContent = useAiChatStore.getState().messages.at(-1)?.content || '';
              const cleaned = currentContent.replace(/<order_lookup>[\s\S]*?<\/order_lookup>/g, '').trim();
              updateLastAssistantMessage(cleaned + '\n\n' + orderInfo);
            } else {
              const currentContent = useAiChatStore.getState().messages.at(-1)?.content || '';
              const cleaned = currentContent.replace(/<order_lookup>[\s\S]*?<\/order_lookup>/g, '').trim();
              updateLastAssistantMessage(cleaned + '\n\nI couldn\'t find that order. Please double-check your order number and the email address you used when placing the order.');
            }
          }
        } catch { /* ignore */ }
      }
    },
    [addItem, updateLastAssistantMessage]
  );

  return { messages, isStreaming, isOpen, sendMessage, toggleChat, setChatOpen, clearMessages };
}
