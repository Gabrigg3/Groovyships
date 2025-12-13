export type NotificationType =
    | "MATCH"
    | "MESSAGE"
    | "LIKE";

export interface Notification {
    id: string;

    // Usuario que recibe la notificación
    userId: string;

    // Tipo de notificación
    type: NotificationType;

    // Datos extra (matchId, otherUserId, etc.)
    payload: Record<string, any>;

    // Si está leída
    read: boolean;

    // Fecha ISO que viene del backend
    createdAt: string;
}