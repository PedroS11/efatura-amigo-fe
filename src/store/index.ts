import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/api/auth/types.ts";

export interface StoreState {
  isLoading: boolean;
  authenticated: boolean;
  user?: User;
}

export interface StoreAction {
  setIsLoading(loading: boolean): void;
  setUser(user: User | undefined): void;
}

export const useAuth = create<StoreState & StoreAction>()(
  persist(
    set => ({
      isLoading: false,
      authenticated: false,
      setIsLoading: (loading: boolean) => set(() => ({ isLoading: loading })),
      setUser: (user: User | undefined) => set(() => ({ user }))
    }),
    {
      name: "efa-storage"
    }
  )
);
