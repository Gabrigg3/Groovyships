import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { useAuthStore } from "@/store/authStore";
import type { MessageResponse } from "@/models/MessageResponse";

export function useChatSocket(
    conversationId: string | undefined,
    onMessage: (msg: MessageResponse) => void
) {
    const accessToken = useAuthStore((s) => s.accessToken);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {

        if (!accessToken || !conversationId) {
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
            return;
        }

        //Conectado
        if (clientRef.current) return;

        const client = new Client({
            webSocketFactory: () =>
                new SockJS("http://localhost:8080/ws"),
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log("+ Chat WS conectado");

            client.subscribe(
                `/topic/conversations/${conversationId}`,
                (frame: IMessage) => {
                    console.log("+ WS CHAT RAW", frame.body);
                    const event = JSON.parse(frame.body);
                    onMessage(event.message);
                }
            );
        };

        client.onStompError = (frame) => {
            console.error("Chat STOMP error", frame);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
            clientRef.current = null;
        };
    }, [accessToken, conversationId, onMessage]);
}
