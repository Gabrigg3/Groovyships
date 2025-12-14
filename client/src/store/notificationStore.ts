// src/store/notificationStore.ts
import { create } from "zustand";
import { Notification } from "@/models/Notification";
import { notificationsApi } from "@/api/notificationsApi";

interface NotificationState {
    notifications: Notification[];

    setNotifications: (n: Notification[]) => void;
    addNotification: (n: Notification) => void;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;

    unreadCount: number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,

    setNotifications: (notifications) =>
        set({
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
        }),

    addNotification: (notification) =>
        set((state) => {
            // ⛔ evitar duplicados
            if (state.notifications.some((n) => n.id === notification.id)) {
                return state;
            }

            const updated = [notification, ...state.notifications];

            return {
                notifications: updated,
                unreadCount: updated.filter((n) => !n.read).length,
            };
        }),

    markAsRead: async (id) => {
        await notificationsApi.markAsRead(id);

        set((state) => {
            const updated = state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            );

            return {
                notifications: updated,
                unreadCount: updated.filter((n) => !n.read).length,
            };
        });
    },

    markAllAsRead: async () => {
        await notificationsApi.markAllAsRead();

        set((state) => ({
            notifications: state.notifications.map((n) => ({
                ...n,
                read: true,
            })),
            unreadCount: 0,
        }));
    },
}));
