import type { Product } from '@/lib/products/types';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  products?: Product[];
  timestamp: number;
}

export interface CartAction {
  action: 'add' | 'remove';
  slug: string;
  quantity: number;
}
