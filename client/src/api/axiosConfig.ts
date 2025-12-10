import axios from "axios";
import { useAuthStore } from "@/store/authStore"; // si aún no existe te lo genero luego

export const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true, // necesario para cookies HttpOnly
});

api.interceptors.response.use(
    (res) => res,

    async (error) => {
        const originalRequest = error.config;

        // Caso típico: Access Token expirado
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Pedimos un nuevo Access Token usando el Refresh Token (cookie HttpOnly)
                const refreshRes = await axios.post(
                    "http://localhost:8080/api/auth/refresh",
                    {},
                    { withCredentials: true }
                );

                const newToken = refreshRes.data.accessToken;

                // Guardamos el nuevo token en localStorage
                localStorage.setItem("accessToken", newToken);

                // Lo añadimos a la cabecera de la petición original
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                // Reintentamos la petición original
                return api(originalRequest);

            } catch (err) {
                // Si también falla el refresh → sesión expirada
                useAuthStore.getState().logout();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);