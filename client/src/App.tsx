























import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { MatchModal } from "./components/MatchModal";
import { useAuthStore } from "@/store/authStore";
import type { UserLight } from "@/models/UserLight";
import type { Notification } from "@/models/Notification";

function App() {
    const userId = useAuthStore((s) => s.userId);
    const accessToken = useAuthStore((s) => s.accessToken);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // ----------------------------
    // MATCH MODAL GLOBAL
    // ----------------------------
    const [matchedProfile, setMatchedProfile] = useState<UserLight | null>(null);
    const [showMatchModal, setShowMatchModal] = useState(false);


    return (
        <Router>
            {!isAuthenticated ? (
                <Routes>
                    <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
                    <Route path="/register/step1" element={<RegisterStep1 />} />
                    <Route path="/register/step2" element={<RegisterStep2 />} />
                    <Route path="/register/step3" element={<RegisterStep3 />} />
                    <Route path="/register/step4" element={<RegisterStep4 onComplete={() => setIsAuthenticated(true)} />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            ) : (
                <>
                    <AppLayout>
                        <Routes>
                            <Route path="/" element={<SwipeDeck />} />
                            <Route path="/matches" element={<Matches />} />
                            <Route path="/messages" element={<Messages />} />
                            <Route path="/messages/:chatId" element={<ChatWindow />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </AppLayout>

                    {/* MATCH MODAL GLOBAL */}
                    {showMatchModal && matchedProfile && (
                        <MatchModal
                            profile={matchedProfile}
                            onClose={() => setShowMatchModal(false)}
                        />
                    )}
                </>
            )}
        </Router>
    );
}

export default App;

/*
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { SwipeDeck } from './pages/SwipeDeck';
import { Matches } from './pages/Matches';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { ChatWindow } from './pages/ChatWindow';
import { Login } from './pages/auth/Login';
import { RegisterStep1 } from './pages/auth/RegisterStep1';
import { RegisterStep2 } from './pages/auth/RegisterStep2';
import { RegisterStep4 } from './pages/auth/RegisterStep4';
import { AppLayout } from './components/AppLayout';


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            {!isAuthenticated ? (
                <Routes>
                    <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
                    <Route path="/register/step1" element={<RegisterStep1 />} />
                    <Route path="/register/step2" element={<RegisterStep2 />} />
                    <Route path="/register/step3" element={<RegisterStep4 onComplete={() => setIsAuthenticated(true)} />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            ) : (
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<SwipeDeck />} />
                        <Route path="/matches" element={<Matches />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/messages/:chatId" element={<ChatWindow />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AppLayout>
            )}
        </Router>
    );
}

export default App;
*/