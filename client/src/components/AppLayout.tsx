import { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
    children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <TopNav />
            <main className="flex-1 pb-20 lg:pb-0">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
