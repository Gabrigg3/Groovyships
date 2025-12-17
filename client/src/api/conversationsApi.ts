import { api } from "@/api/axiosConfig";
import { ConversationResponse } from "@/models/ConversationResponse";

export const conversationsApi = {
    async getMyConversations(): Promise<ConversationResponse[]> {
        const res = await api.get("/api/v0/conversations");
        return res.data;
    }
};
