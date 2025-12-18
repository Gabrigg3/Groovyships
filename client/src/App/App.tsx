import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { SwipeDeck } from "@/pages/SwipeDeck";
import { Matches } from "@/pages/Matches";
import { Messages } from "@/pages/Messages";
import { ChatWindow } from "@/pages/ChatWindow";
import { Notifications } from "@/pages/Notifications";
import { Profile } from "@/pages/Profile";

import { Login } from "@/pages/auth/Login";
import { RegisterStep1 } from "@/pages/auth/RegisterStep1";
import { RegisterStep2 } from "@/pages/auth/RegisterStep2";
import { RegisterStep3 } from "@/pages/auth/RegisterStep3";
import { RegisterStep4 } from "@/pages/auth/RegisterStep4";
import { RegisterStep5 } from "@/pages/auth/RegisterStep5";

import { AuthGate } from "@/auth/AuthGate";
import { ProtectedLayout } from "@/layouts/ProtectedLayout";
import { useBootstrapAuth } from "@/hooks/useBootstrapAuth";

function AppRoutes() {

    useBootstrapAuth();

    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/login" element={<Login />} />
            <Route path="/register/step1" element={<RegisterStep1 />} />
            <Route path="/register/step2" element={<RegisterStep2 />} />
            <Route path="/register/step3" element={<RegisterStep3 />} />
            <Route path="/register/step4" element={<RegisterStep4 />} />
            <Route path="/register/step5" element={<RegisterStep5 />} />

            {/* PROTECTED */}
            <Route element={<AuthGate />}>
                <Route element={<ProtectedLayout />}>
                    <Route path="/" element={<SwipeDeck />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/messages/:chatId" element={<ChatWindow />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}
