
import axios from "axios";
import type { Interes } from "@/models/Interes";

const API_URL = "http://localhost:8080/api/interests";

export const interestsApi = {
    async getAll(): Promise<Interes[]> {
        const res = await axios.get<Interes[]>(API_URL, {
            withCredentials: true,
        });
        return res.data;
    },
};