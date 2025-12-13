import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { MessageResponse } from "@/models/MessageResponse";

export function useChatSocket(
    conversationId: string | undefined,
    onMessage: (msg: MessageResponse) => void
) {
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!conversationId) return;

        const client = new Client({
            webSocketFactory: () =>
                new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            client.subscribe(
                `/topic/conversations/${conversationId}`,
                (frame: IMessage) => {
                    const event = JSON.parse(frame.body);
                    onMessage(event.message);
                }
            );
        };

        client.activate();
        clientRef.current = client;

        // ✅ cleanup síncrono y seguro
        return () => {
            clientRef.current?.deactivate();
            clientRef.current = null;
        };
    }, [conversationId, onMessage]);
}
