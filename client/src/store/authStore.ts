import { create } from "zustand";

interface AuthState {
    userId: string;
    accessToken: string | null;

    setAccessToken: (accessToken: string, userId?: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    userId: localStorage.getItem("userId") ?? "",
    accessToken: localStorage.getItem("accessToken"),

    setAccessToken: (accessToken, userId) => {
        localStorage.setItem("accessToken", accessToken);
        if (userId) localStorage.setItem("userId", userId);

        set({ accessToken, userId });
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        set({ userId: "", accessToken: null });
    },
}));
