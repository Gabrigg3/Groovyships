import { api } from "@/api/axiosConfig";
import type { Notification } from "@/models/Notification";

const API_URL = "http://localhost:8080/api/notifications";

export const notificationsApi = {

    //Obtener TODAS las notificaciones del usuario
    async getAll(userId: string): Promise<Notification[]> {
        const res = await api.get<Notification[]>(
            `${API_URL}/${userId}`,
            { withCredentials: true }
        );
        return res.data;
    },

    //Obtener SOLO las no leídas (para polling)
    async getUnread(userId: string): Promise<Notification[]> {
        const res = await api.get<Notification[]>(
            `${API_URL}/${userId}/unread`,
            { withCredentials: true }
        );
        return res.data;
    },

    //Marcar UNA notificación como leída
    async markAsRead(notificationId: string): Promise<void> {
        await api.post(
            `${API_URL}/${notificationId}/read`,
            {},
            { withCredentials: true }
        );
    },

    //Marcar TODAS como leídas (opcional)
    async markAllAsRead(userId: string): Promise<void> {
        await api.post(
            `${API_URL}/${userId}/read-all`,
            {},
            { withCredentials: true }
        );
    },
};