import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/api/authApi";

export const apiHttp = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

apiHttp.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiHttp.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        if (original._retry) {
            useAuthStore.getState().clearSession();
            return Promise.reject(error);
        }

        original._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = authApi
                    .refresh()
                    .then((res) => res.accessToken)
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const newToken = await refreshPromise;

            //API NUEVA DEL STORE
            useAuthStore
                .getState()
                .setSession(newToken, useAuthStore.getState().userId);

            original.headers.Authorization = `Bearer ${newToken}`;
            return apiHttp(original);
        } catch (e) {
            useAuthStore.getState().clearSession();
            return Promise.reject(e);
        }
    }
);
