import axios from "axios";

const API_URL = "http://localhost:8080/auth/v0";

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    nombre: string;
    email: string;
    telefono: number;
    password: string;

    edad: number;
    rangoEdad: number[];
    biografia: string;
    intereses: string[];
    ubicacion: string;
    imagenes: string[];
    lookingFor: string[];
    ocupacion: string;
}

export interface AuthResponse {
    accessToken: string;
    userId: string;
}

export interface RefreshResponse {
    accessToken: string;
}

export const authApi = {

    async register(data: RegisterDTO): Promise<AuthResponse> {
        const res = await axios.post<AuthResponse>(
            `${API_URL}/register`,
            data,
            { withCredentials: true }
        );
        return res.data;
    },

    async login(credentials: LoginDTO): Promise<AuthResponse> {
        const res = await axios.post<AuthResponse>(
            `${API_URL}/login`,
            credentials,
            { withCredentials: true }
        );
        return res.data;
    },

    async refresh(): Promise<RefreshResponse> {
        const res = await axios.post<RefreshResponse>(
            `${API_URL}/refresh`,
            {},
            { withCredentials: true }
        );
        return res.data;
    },
};
