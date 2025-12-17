import { apiHttp  } from "@/api/axiosConfig";
import { MessageResponse, MessageType } from "@/models/MessageResponse";

export const messagesApi = {
    async getMessages(conversationId: string): Promise<MessageResponse[]> {
        const res = await apiHttp.get(
            `/api/v0/conversations/${conversationId}/messages`
        );
        return res.data;
    },

    async sendMessage(
        conversationId: string,
        type: MessageType,
        content: string
    ): Promise<void> {
        await apiHttp.post(
            `/api/v0/conversations/${conversationId}/messages`,
            { type, content }
        );
    },
};
