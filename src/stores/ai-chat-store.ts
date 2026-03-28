'use client';

import { create } from 'zustand';
import type { ChatMessage } from '@/types/chat';

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isStreaming: boolean;
  addMessage: (message: ChatMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  setStreaming: (streaming: boolean) => void;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
  clearMessages: () => void;
}

export const useAiChatStore = create<ChatState>()((set) => ({
  messages: [],
  isOpen: false,
  isStreaming: false,

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  updateLastAssistantMessage: (content) => {
    set((state) => {
      const messages = [...state.messages];
      const lastIndex = messages.length - 1;
      if (lastIndex >= 0 && messages[lastIndex].role === 'assistant') {
        messages[lastIndex] = { ...messages[lastIndex], content };
      }
      return { messages };
    });
  },

  setStreaming: (streaming) => set({ isStreaming: streaming }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setChatOpen: (open) => set({ isOpen: open }),
  clearMessages: () => set({ messages: [] }),
}));
