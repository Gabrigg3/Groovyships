import { apiHttp } from "./http";

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

export const authApi = {
    login(credentials: LoginDTO): Promise<AuthResponse> {
        return apiHttp
            .post<AuthResponse>("/auth/v0/login", credentials)
            .then((res) => res.data);
    },

    register(data: RegisterDTO): Promise<AuthResponse> {
        return apiHttp
            .post<AuthResponse>("/auth/v0/register", data)
            .then((res) => res.data);
    },

    refresh(): Promise<{ accessToken: string }> {
        return apiHttp
            .post<{ accessToken: string }>("/auth/v0/refresh")
            .then((res) => res.data);
    },

    logout(userId: string): Promise<void> {
        return apiHttp
            .post("/auth/v0/logout", { userId })
            .then(() => {});
    },
};


