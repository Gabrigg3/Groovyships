import axios from "axios";
import type { UserLight } from "@/models/UserLight";
import type { Match } from "@/models/Match";

const API_URL = "http://localhost:8080/api/matches";

export const matchesApi = {

    // Obtener sugerencias de usuarios
    async getSuggestions(userId: string): Promise<UserLight[]> {
        const res = await axios.get<UserLight[]>(`${API_URL}/suggestions/${userId}`);
        return res.data;
    },

    // Enviar LIKE a un usuario → devuelve objeto Match
    async like(userId: string, targetId: string): Promise<Match> {
        const res = await axios.post<Match>(`${API_URL}/${userId}/like/${targetId}`);
        return res.data;
    },

    // Enviar DISLIKE a un usuario → devuelve objeto Match
    async dislike(userId: string, targetId: string): Promise<Match> {
        const res = await axios.post<Match>(`${API_URL}/${userId}/dislike/${targetId}`);
        return res.data;
    }
};