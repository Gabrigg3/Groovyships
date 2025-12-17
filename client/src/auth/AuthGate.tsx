import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function AuthGate() {
    const { hydrated, accessToken } = useAuthStore();

    if (!hydrated) {
        return null; // o spinner
    }

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
