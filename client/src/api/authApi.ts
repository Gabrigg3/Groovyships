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

export const authApi = {

    async register(data: RegisterDTO): Promise<LoginResponse> {
        const res = await axios.post<LoginResponse>(`${API_URL}/register`, data, {
            withCredentials: true,
        });
        return res.data;
    },

    async login(credentials: LoginDTO): Promise<LoginResponse> {
        const res = await axios.post<LoginResponse>(`${API_URL}/login`, credentials, {
            withCredentials: true,
        });
        return res.data;
    },

    refresh(refreshToken: string): Promise<LoginResponse> {
        return axios
            .post<LoginResponse>(`${API_URL}/refresh`, { refreshToken }, { withCredentials: true })
            .then((res) => res.data);
    },
};