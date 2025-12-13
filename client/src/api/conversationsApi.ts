import { api } from "@/api/axiosConfig";
import { ConversationResponse } from "@/models/ConversationResponse";

export const conversationsApi = {
    async getMyConversations(): Promise<ConversationResponse[]> {
        const res = await api.get("/api/conversations");
        return res.data;
    }
};
