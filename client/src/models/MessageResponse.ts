export type MessageType = "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";

export interface MessageResponse {
    id: string;
    conversationId: string;
    senderId: string;
    type: MessageType;
    content: string;
    sentAt: string;
}
