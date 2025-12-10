import axios from "axios";

const API_URL = "http://localhost:8080/auth";

export interface LoginDTO {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
}

export const authApi = {
    async login(credentials: LoginDTO): Promise<LoginResponse> {
        const res = await axios.post<LoginResponse>(`${API_URL}/login`, credentials, {
            withCredentials: true, // necesario si la cookie la pone el servidor
        });
        return res.data;
    },
};