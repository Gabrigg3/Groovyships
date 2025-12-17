import axios from "axios";
import type { UserLight } from "@/models/UserLight";
import { useAuthStore } from "@/store/authStore";

const API_URL = "http://localhost:8080/api/v0/usuarios";

export const usersApi = {
    async getById(userId: string): Promise<UserLight> {
        const token = useAuthStore.getState().accessToken;

        if (!token) {
            throw new Error("No access token disponible");
        }

        const res = await axios.get<UserLight>(
            `${API_URL}/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return res.data;
    },
};