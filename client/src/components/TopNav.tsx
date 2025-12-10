import { Bell, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate, useLocation } from 'react-router-dom';

export function TopNav() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16 lg:h-20">
            <div className="container mx-auto h-full px-4 lg:px-8 flex items-center justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="text-gradient-1 text-2xl lg:text-3xl font-bold font-sans cursor-pointer hover:opacity-80 transition-opacity"
                >
                    VibeConnect
                </button>

                <div className="flex items-center gap-2 lg:gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={() => navigate('/messages')}
                    >
                        <Bell className="w-6 h-6 lg:w-7 lg:h-7" strokeWidth={1.5} />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={() => navigate('/messages')}
                    >
                        <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7" strokeWidth={1.5} />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground rounded-full"
                            >
                                <Avatar className="w-10 h-10 lg:w-12 lg:h-12">
                                    <AvatarImage src="https://c.animaapp.com/miuehdn2n7lalI/img/ai_1.png" alt="portrait user" />
                                    <AvatarFallback className="bg-primary text-primary-foreground">ME</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover text-popover-foreground">
                            <DropdownMenuItem
                                onClick={() => navigate('/profile')}
                                className="cursor-pointer text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                                <User className="mr-2 w-4 h-4" strokeWidth={1.5} />
                                Profile Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}
