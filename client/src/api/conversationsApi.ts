import { apiHttp } from "@/api/axiosConfig";
import { ConversationResponse } from "@/models/ConversationResponse";

export const conversationsApi = {
    async getMyConversations(): Promise<ConversationResponse[]> {
        const res = await apiHttp.get("/api/v0/conversations");
        return res.data;
    }
};
