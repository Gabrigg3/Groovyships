import { Home, Heart, MessageCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Swipe' },
        { path: '/matches', icon: Heart, label: 'Matches' },
        { path: '/messages', icon: MessageCircle, label: 'Messages' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    const isActive = (path: string) => {
        if (path === '/messages') {
            return location.pathname.startsWith('/messages');
        }
        return location.pathname === path;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border lg:hidden">
            <div className="flex items-center justify-around h-16 px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Button
                            key={item.path}
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center gap-1 h-auto py-2 px-3 ${
                                active
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                        >
                            <Icon className="w-6 h-6" strokeWidth={1.5} />
                            <span className="text-xs font-body">{item.label}</span>
                        </Button>
                    );
                })}
            </div>
        </nav>
    );
}
