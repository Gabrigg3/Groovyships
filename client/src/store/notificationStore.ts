import { create } from "zustand";
import { Notification } from "@/models/Notification";
import { notificationsApi } from "@/api/notificationsApi";
import type { InfoCard } from "@/models/InfoCard";

interface NotificationState {

    //DATA
    notifications: Notification[];
    unreadCount: number;

    //MATCH MODAL (UI)
    showMatchModal: boolean;
    matchedProfile: InfoCard | null;

    //ACTIONS
    setNotifications: (n: Notification[]) => void;
    addNotification: (n: Notification) => void;

    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;

    openMatchModal: () => void;

    closeMatchModal: () => void;
    reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({

    //STATE
    notifications: [],
    unreadCount: 0,

    showMatchModal: false,
    matchedProfile: null,


    //SET ALL (initial load)
    setNotifications: (notifications) =>
        set({
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
        }),
    openMatchModal: () =>
        set({
            showMatchModal: true,
        }),

    //ADD (WebSocket)
    addNotification: (notification) =>
        set((state) => {
            //Evitamos duplicados
            if (state.notifications.some((n) => n.id === notification.id)) {
                return state;
            }

            const updated = [notification, ...state.notifications];

            //MATCH -> abrir modal
            if (notification.type === "MATCH") {
                const p = notification.payload?.profile;

                const mappedProfile: InfoCard | null = p
                    ? {
                        id: p.id,
                        name: p.nombre,
                        age: p.edad ?? 18,
                        gender: p.generoUsuario ?? "otro",

                        bio: p.biografia ?? "",
                        images: p.imagenes ?? [],
                        imageAlt: p.nombre,

                        location: p.ubicacion ?? "—",
                        occupation: p.ocupacion ?? "—",
                        interests: p.intereses ?? [],

                        lookingFor: p.lookingFor ?? [],
                    }
                    : null;

                return {
                    notifications: updated,
                    unreadCount: updated.filter((n) => !n.read).length,
                    matchedProfile: mappedProfile,
                };
            }

            return {
                notifications: updated,
                unreadCount: updated.filter((n) => !n.read).length,
            };
        }),


    //MARK AS READ
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
            console.error("+ Error marking notification as read", e);
        }
    },


    //MARK ALL AS READ
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
            console.error("+ Error marking all notifications as read", e);
        }
    },


    //MATCH MODAL
    closeMatchModal: () =>
        set({
            showMatchModal: false,
            matchedProfile: null,
        }),


    //RESET (logout)
    reset: () =>
        set({
            notifications: [],
            unreadCount: 0,
            showMatchModal: false,
            matchedProfile: null,
        }),
}));