import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";

export function useNotificationSocket() {
    const accessToken = useAuthStore((s) => s.accessToken);
    const addNotification = useNotificationStore((s) => s.addNotification);

    const clientRef = useRef<Client | null>(null);

    useEffect(() => {

        if (!accessToken) {
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
            return;
        }

        if (clientRef.current) return;

        const client = new Client({
            webSocketFactory: () =>
                new SockJS("http://localhost:8080/ws"),
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            reconnectDelay: 5000,
            debug: (msg) => {

            },
        });

        client.onConnect = () => {
            console.log("+ WebSocket conectado");

            client.subscribe("/user/queue/notifications", (message) => {
                console.log("+ WS RAW MESSAGE", message.body);
                const notification = JSON.parse(message.body);
                console.log("+ WS PARSED", notification);
                addNotification(notification);
            });
        };

        client.onStompError = (frame) => {
            console.error("+ STOMP error", frame);
        };

        client.activate();
        clientRef.current = client;

        // 🧹 CLEANUP
        return () => {
            client.deactivate();
            clientRef.current = null;
        };
    }, [accessToken, addNotification]);
}
