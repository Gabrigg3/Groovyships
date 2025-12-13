import { api } from "@/api/axiosConfig";   // ← Usa tu instancia con token
import type { UserLight } from "@/models/UserLight";
import type { Match } from "@/models/Match";

const API_URL = "/api/matches";

export const matchesApi = {

    async getSuggestions(userId: string): Promise<UserLight[]> {
        const res = await api.get<UserLight[]>(`${API_URL}/suggestions/${userId}`);
        return res.data;
    },

    //Enviar LIKE -> devuelve un Match
    async like(userId: string, targetId: string): Promise<Match> {
        const res = await api.post<Match>(`${API_URL}/${userId}/like/${targetId}`);
        return res.data;
    },

    //Enviar DISLIKE -> devuelve un Match
    async dislike(userId: string, targetId: string): Promise<Match> {
        const res = await api.post<Match>(`${API_URL}/${userId}/dislike/${targetId}`);
        return res.data;
    }
};