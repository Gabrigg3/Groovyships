// src/store/notificationStore.ts
import { create } from "zustand";
import { Notification } from "@/models/Notification";
import { notificationsApi } from "@/api/notificationsApi";
import type { UserLight } from "@/models/UserLight";

interface NotificationState {
    /* -----------------------------
       DATA
    ----------------------------- */
    notifications: Notification[];
    unreadCount: number;

    /* -----------------------------
       MATCH MODAL (UI)
    ----------------------------- */
    showMatchModal: boolean;
    matchedProfile: UserLight | null;

    /* -----------------------------
       ACTIONS
    ----------------------------- */
    setNotifications: (n: Notification[]) => void;
    addNotification: (n: Notification) => void;

    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;

    closeMatchModal: () => void;
    reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    /* -----------------------------
       STATE
    ----------------------------- */
    notifications: [],
    unreadCount: 0,

    showMatchModal: false,
    matchedProfile: null,

    /* -----------------------------
       SET ALL (initial load)
    ----------------------------- */
    setNotifications: (notifications) =>
        set({
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
        }),

    /* -----------------------------
       ADD (WebSocket)
    ----------------------------- */
    addNotification: (notification) =>
        set((state) => {
            // ⛔ evitar duplicados
            if (state.notifications.some((n) => n.id === notification.id)) {
                return state;
            }

            const updated = [notification, ...state.notifications];

            // 💖 MATCH → abrir modal tipo Tinder
            if (notification.type === "MATCH") {
                return {
                    notifications: updated,
                    unreadCount: updated.filter((n) => !n.read).length,

                    showMatchModal: true,
                    matchedProfile: notification.payload?.profile ?? null,
                };
            }

            return {
                notifications: updated,
                unreadCount: updated.filter((n) => !n.read).length,
            };
        }),

    /* -----------------------------
       MARK ONE AS READ
    ----------------------------- */
    markAsRead: async (id) => {
        try {
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
        } catch (e) {
            console.error("❌ Error marking notification as read", e);
        }
    },

    /* -----------------------------
       MARK ALL AS READ
    ----------------------------- */
    markAllAsRead: async () => {
        try {
            await notificationsApi.markAllAsRead();

            set((state) => ({
                notifications: state.notifications.map((n) => ({
                    ...n,
                    read: true,
                })),
                unreadCount: 0,
            }));
        } catch (e) {
            console.error("❌ Error marking all notifications as read", e);
        }
    },

    /* -----------------------------
       MATCH MODAL
    ----------------------------- */
    closeMatchModal: () =>
        set({
            showMatchModal: false,
            matchedProfile: null,
        }),

    /* -----------------------------
       RESET (logout)
    ----------------------------- */
    reset: () =>
        set({
            notifications: [],
            unreadCount: 0,
            showMatchModal: false,
            matchedProfile: null,
        }),
}));
