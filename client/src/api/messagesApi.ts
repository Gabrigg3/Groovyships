import { api  } from "@/api/axiosConfig";
import { MessageResponse, MessageType } from "@/models/MessageResponse";

export const messagesApi = {
    async getMessages(conversationId: string): Promise<MessageResponse[]> {
        const res = await api.get(
            `/api/conversations/${conversationId}/messages`
        );
        return res.data;
    },

    async sendMessage(
        conversationId: string,
        type: MessageType,
        content: string
    ): Promise<void> {
        await api.post(
            `/api/conversations/${conversationId}/messages`,
            { type, content }
        );
    },
};
