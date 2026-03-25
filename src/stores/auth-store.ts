'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  email: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface AuthState {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (profile: UserProfile) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,

      login: (profile) => {
        set({ user: profile, isLoggedIn: true });
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
      },

      updateProfile: (updates) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...updates } });
        }
      },
    }),
    { name: 'rks-us-auth' }
  )
);
