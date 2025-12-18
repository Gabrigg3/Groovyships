import { apiHttp } from "@/api/axiosConfig";
import type { Notification } from "@/models/Notification";

export const notificationsApi = {
    //TODAS
    async getAll(): Promise<Notification[]> {
        const res = await apiHttp.get<Notification[]>(
            "/api/v0/notifications"
        );
        return res.data;
    },

    //SOLO NO LEÍDAS
    async getUnread(): Promise<Notification[]> {
        const res = await apiHttp.get<Notification[]>(
            "/api/v0/notifications/unread"
        );
        return res.data;
    },

    //MARCAR UNA
    async markAsRead(notificationId: string): Promise<void> {
        await apiHttp.post(
            `/api/v0/notifications/${notificationId}/read`
        );
    },

    //MARCAR TODAS
    async markAllAsRead(): Promise<void> {
        await apiHttp.post(
            "/api/v0/notifications/read-all"
        );
    },
};
