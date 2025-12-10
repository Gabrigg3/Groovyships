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
import { AppLayout } from './components/AppLayout';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            {!isAuthenticated ? (
                <Routes>
                    <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
                    <Route path="/register/step1" element={<RegisterStep1 />} />
                    <Route path="/register/step2" element={<RegisterStep2 onComplete={() => setIsAuthenticated(true)} />} />
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
