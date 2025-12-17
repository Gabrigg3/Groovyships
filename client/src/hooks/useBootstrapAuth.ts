import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/api/authApi";

export function useBootstrapAuth() {
    const setSession = useAuthStore((s) => s.setSession);
    const setHydrated = useAuthStore((s) => s.setHydrated);

    useEffect(() => {
        authApi
            .refresh()
            .then(({ accessToken }) => {
                // 🔑 el refresh NO cambia de usuario
                const currentUserId = useAuthStore.getState().userId;
                setSession(accessToken, currentUserId);
            })
            .catch(() => {
                // ❌ NO clearSession aquí
                // Solo significa que no había sesión previa
            })
            .finally(() => {
                setHydrated();
            });
    }, [setSession, setHydrated]);
}
