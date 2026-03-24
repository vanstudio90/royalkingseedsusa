'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from '@/lib/products/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, variant?: { label: string; price: number }) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

function getCartKey(item: CartItem): string {
  return item.selectedVariant
    ? `${item.product.id}::${item.selectedVariant.label}`
    : item.product.id;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, variant) => {
        const items = get().items;
        const key = variant ? `${product.id}::${variant.label}` : product.id;
        const existing = items.find((i) => getCartKey(i) === key);
        if (existing) {
          set({
            items: items.map((i) =>
              getCartKey(i) === key
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, quantity, selectedVariant: variant }] });
        }
      },

      removeItem: (cartKey) => {
        set({ items: get().items.filter((i) => getCartKey(i) !== cartKey) });
      },

      updateQuantity: (cartKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartKey);
          return;
        }
        set({
          items: get().items.map((i) =>
            getCartKey(i) === cartKey ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => {
          const unitPrice = i.selectedVariant?.price ?? i.product.price;
          return sum + unitPrice * i.quantity;
        }, 0),
    }),
    { name: 'rks-us-cart' }
  )
);

export { getCartKey };
