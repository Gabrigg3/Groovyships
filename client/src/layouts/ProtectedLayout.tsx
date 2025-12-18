import { Outlet } from "react-router-dom";
import { useEffect } from "react";

import { AppLayout } from "@/components/AppLayout";
import { MatchModal } from "@/components/MatchModal";

import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { useNotificationStore } from "@/store/notificationStore";
import { useAuthStore } from "@/store/authStore";
import { usersApi } from "@/api/userApi";

export function ProtectedLayout() {

    useNotificationSocket();

    const userId = useAuthStore((s) => s.userId);
    const currentUser = useAuthStore((s) => s.currentUser);
    const setCurrentUser = useAuthStore((s) => s.setCurrentUser);

    const showMatchModal = useNotificationStore((s) => s.showMatchModal);
    const matchedProfile = useNotificationStore((s) => s.matchedProfile);
    const openMatchModal = useNotificationStore((s) => s.openMatchModal);
    const closeMatchModal = useNotificationStore((s) => s.closeMatchModal);


    useEffect(() => {
        if (matchedProfile) {
            openMatchModal();
        }
    }, [matchedProfile, openMatchModal]);

    //Cargar usuario logueado UNA sola vez
    useEffect(() => {
        if (!userId || currentUser) return;

        usersApi
            .getById(userId)
            .then(setCurrentUser)
            .catch((e) => {
                console.error("Error cargando usuario logueado", e);
            });
    }, [userId, currentUser, setCurrentUser]);

    return (
        <AppLayout>
            <Outlet />

            {showMatchModal && matchedProfile && currentUser && (
                <MatchModal
                    currentUser={currentUser}
                    matchedUser={matchedProfile}
                    onClose={closeMatchModal}
                />
            )}
        </AppLayout>
    );
}
