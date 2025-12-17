import { create } from "zustand";
import type { InfoCard } from "@/models/InfoCard";

type AuthState = {
    // 🔐 auth
    accessToken: string | null;
    userId: string | null;
    hydrated: boolean;

    // 👤 usuario logueado (GLOBAL)
    currentUser: InfoCard | null;

    // setters
    setSession: (token: string, userId: string | null) => void;
    setCurrentUser: (user: InfoCard) => void;
    clearSession: () => void;
    setHydrated: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    userId: null,
    hydrated: false,

    currentUser: null,

    setSession: (token, userId) =>
        set({
            accessToken: token,
            userId,
        }),

    setCurrentUser: (user) =>
        set({
            currentUser: user,
        }),

    clearSession: () =>
        set({
            accessToken: null,
            userId: null,
            currentUser: null,
            hydrated: true, // importante: no bloquear la app
        }),

    setHydrated: () => set({ hydrated: true }),
}));
