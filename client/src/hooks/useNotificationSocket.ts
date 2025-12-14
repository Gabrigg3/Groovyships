// src/hooks/useNotificationSocket.ts
import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Notification } from "@/models/Notification";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";

export function useNotificationSocket() {
    const { userId } = useAuthStore();
    const addNotification = useNotificationStore(
        (s) => s.addNotification
    );

    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!userId) return;

        const client = new Client({
            webSocketFactory: () =>
                new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 5000,
            debug: () => {},
        });

        client.onConnect = () => {
            client.subscribe(
                `/topic/notifications/${userId}`,
                (frame: IMessage) => {
                    try {
                        const notification: Notification =
                            JSON.parse(frame.body);

                        addNotification(notification);
                    } catch (e) {
                        console.error(
                            "❌ Error parsing notification",
                            e
                        );
                    }
                }
            );
        };

        client.activate();
        clientRef.current = client;

        return () => {
            clientRef.current?.deactivate();
            clientRef.current = null;
        };
    }, [userId, addNotification]);
}
