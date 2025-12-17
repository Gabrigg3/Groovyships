import { create } from "zustand";
import type { InfoCard } from "@/models/InfoCard";
import { usersApi } from "@/api/userApi";

type UserState = {
    user: InfoCard | null;
    loading: boolean;

    fetchMe: (userId: string) => Promise<void>;
    clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
    user: null,
    loading: false,

    fetchMe: async (userId) => {
        set({ loading: true });
        try {
            const user = await usersApi.getById(userId);
            set({ user });
        } finally {
            set({ loading: false });
        }
    },

    clearUser: () => set({ user: null }),
}));
