import axios from "axios";
import { useAuthStore } from "@/store/authStore";

// Axios principal
export const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true, // necesario para cookie HttpOnly del refresh
});

/* ----------------------------------------------------
   1) REQUEST INTERCEPTOR → añade ACCESS TOKEN
---------------------------------------------------- */
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

/* ----------------------------------------------------
   2) RESPONSE INTERCEPTOR → si 401 → usar REFRESH TOKEN
---------------------------------------------------- */
api.interceptors.response.use(
    (res) => res,

    async (error) => {
        const originalRequest = error.config;

        // si expiró el accessToken y aún no reintentamos
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // pedir nuevo access token
                const refreshApi = axios.create({
                    baseURL: "http://localhost:8080",
                    withCredentials: true,
                });

                const refreshRes = await refreshApi.post("/auth/v0/refresh");


                const newAccess = refreshRes.data.accessToken;

                // actualizamos tokens en el store
                useAuthStore.getState().setAccessToken(
                    newAccess,
                    useAuthStore.getState().userId ?? undefined
                );

                // añadimos nuevo accessToken a la petición original
                originalRequest.headers.Authorization = `Bearer ${newAccess}`;

                // reintentamos
                return api(originalRequest);

            } catch (err) {
                console.error("❌ Error al refrescar token:", err);

                useAuthStore.getState().logout();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);