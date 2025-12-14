import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet
} from "react-router-dom";
import { useState, useEffect } from "react";

import { SwipeDeck } from "./pages/SwipeDeck";
import { Matches } from "./pages/Matches";
import { Messages } from "./pages/Messages";
import { Profile } from "./pages/Profile";
import { ChatWindow } from "./pages/ChatWindow";
import { Login } from "./pages/auth/Login";
import { RegisterStep1 } from "./pages/auth/RegisterStep1";
import { RegisterStep2 } from "./pages/auth/RegisterStep2";
import { RegisterStep3 } from "./pages/auth/RegisterStep3";
import { RegisterStep4 } from "./pages/auth/RegisterStep4";
import { AppLayout } from "./components/AppLayout";

import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import {Notifications} from "@/pages/Notifications";
import {useNotificationStore} from "@/store/notificationStore";
import {MatchModal} from "@/components/MatchModal";

function ProtectedLayout() {
    // 🔌 WebSocket de notificaciones (una sola vez)
    useNotificationSocket();

    // 💖 Match modal desde el store de notificaciones
    const {
        showMatchModal,
        matchedProfile,
        closeMatchModal,
    } = useNotificationStore();

    return (
        <AppLayout>
            <Outlet />

            {/* MATCH MODAL GLOBAL (tipo Tinder) */}
            {showMatchModal && matchedProfile && (
                <MatchModal
                    profile={matchedProfile}
                    onClose={closeMatchModal}
                />
            )}
        </AppLayout>
    );
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <Routes>
                {!isAuthenticated ? (
                    <>
                        <Route
                            path="/login"
                            element={<Login onLogin={() => setIsAuthenticated(true)} />}
                        />
                        <Route path="/register/step1" element={<RegisterStep1 />} />
                        <Route path="/register/step2" element={<RegisterStep2 />} />
                        <Route path="/register/step3" element={<RegisterStep3 />} />
                        <Route
                            path="/register/step4"
                            element={<RegisterStep4 onComplete={() => setIsAuthenticated(true)} />}
                        />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                ) : (
                    <Route element={<ProtectedLayout />}>
                        <Route path="/" element={<SwipeDeck />} />
                        <Route path="/matches" element={<Matches />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/messages/:chatId" element={<ChatWindow />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                )}
            </Routes>
        </Router>
    );
}
