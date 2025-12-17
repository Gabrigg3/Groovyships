
import { apiHttp } from "@/api/axiosConfig";
import type { Interes } from "@/models/Interes";

const API_URL = "http://localhost:8080/api/v0/interests";

export const interestsApi = {
    async getAll(): Promise<Interes[]> {
        const res = await apiHttp.get<Interes[]>(API_URL, {
            withCredentials: true,
        });
        return res.data;
    },
};