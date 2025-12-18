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

                const currentUserId = useAuthStore.getState().userId;
                setSession(accessToken, currentUserId);
            })
            .catch(() => {

            })
            .finally(() => {
                setHydrated();
            });
    }, [setSession, setHydrated]);
}
