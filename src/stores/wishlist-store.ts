'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/products/types';

function getAuthEmail(): string | null {
  try {
    const raw = localStorage.getItem('rks-us-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.email || null;
  } catch {
    return null;
  }
}

function syncToDb(action: string, product?: { slug: string; name: string }, allItems?: { slug: string; name: string }[]) {
  const email = getAuthEmail();
  if (!email) return;

  const body: Record<string, unknown> = { email, action };
  if (product) body.product = product;
  if (allItems) body.items = allItems;

  fetch('/api/account/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {});
}

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;
        if (!items.find((i) => i.id === product.id)) {
          set({ items: [...items, product] });
          syncToDb('add', { slug: product.slug, name: product.name });
        }
      },

      removeItem: (productId) => {
        const item = get().items.find((i) => i.id === productId);
        set({ items: get().items.filter((i) => i.id !== productId) });
        if (item) syncToDb('remove', { slug: item.slug, name: item.name });
      },

      toggleItem: (product) => {
        const items = get().items;
        if (items.find((i) => i.id === product.id)) {
          set({ items: items.filter((i) => i.id !== product.id) });
          syncToDb('remove', { slug: product.slug, name: product.name });
        } else {
          set({ items: [...items, product] });
          syncToDb('add', { slug: product.slug, name: product.name });
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.id === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
        syncToDb('sync', undefined, []);
      },

      totalItems: () => get().items.length,
    }),
    { name: 'rks-us-wishlist' }
  )
);
