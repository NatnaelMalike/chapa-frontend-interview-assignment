// src/store/auth-store.ts
import { User } from "@/types/user";
import { create } from "zustand";

type AuthStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
