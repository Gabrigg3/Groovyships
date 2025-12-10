import { create } from "zustand";

interface AuthState {
    userId: string | null;
    accessToken: string | null;

    login: (userId: string, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    userId: null,
    accessToken: null,

    login: (userId, token) => {
        localStorage.setItem("accessToken", token);
        set({ userId, accessToken: token });
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        set({ userId: null, accessToken: null });
    },
}));