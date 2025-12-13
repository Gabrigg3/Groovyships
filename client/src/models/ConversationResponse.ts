export interface ConversationResponse {
    conversationId: string;
    otherUserId: string;
    otherUserName: string;
    otherUserImage?: string;
    lastMessage?: string;
    lastMessageAt?: string;
}