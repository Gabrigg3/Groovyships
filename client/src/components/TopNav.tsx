import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useUserStore } from "@/store/userStore";

import { authApi } from "@/api/authApi";
import {Button} from "@/components/ui/button";
import {Bell, MessageCircle, User} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export function TopNav() {
    const navigate = useNavigate();

    //AUTH
    const { userId, clearSession } = useAuthStore();

    //USER
    const { user, fetchMe, clearUser } = useUserStore();

    //NOTIFICATIONS
    const unreadCount = useNotificationStore((s) => s.unreadCount);


    //CARGAR / REFRESCAR USUARIO LOGUEADO
    useEffect(() => {
        if (!userId) {
            clearUser();
            return;
        }

        fetchMe(userId);
    }, [userId, fetchMe, clearUser]);


    //LOGOUT
    const handleLogout = async () => {
        try {
            if (userId) {
                await authApi.logout(userId);
            }
        } catch (err) {
            console.warn("Logout backend falló");
        } finally {
            clearSession();
            clearUser();
            navigate("/login");
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16 lg:h-20">
            <div className="container mx-auto h-full px-4 lg:px-8 flex items-center justify-between">

                {/* LOGO */}
                <button
                    onClick={() => navigate('/')}
                    className="text-gradient-1 text-2xl lg:text-3xl font-bold font-sans cursor-pointer hover:opacity-80 transition-opacity"
                >
                    Groovyships
                </button>

                {/* ACTIONS */}
                <div className="flex items-center gap-2 lg:gap-4">

                    {/* NOTIFICATIONS */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={() => navigate('/notifications')}
                    >
                        <Bell className="w-6 h-6 lg:w-7 lg:h-7" strokeWidth={1.5} />

                        {unreadCount > 0 && (
                            <span
                                className="
                                    absolute -top-1 -right-1
                                    min-w-[18px] h-[18px]
                                    bg-primary text-primary-foreground
                                    text-xs font-bold
                                    rounded-full
                                    flex items-center justify-center
                                    px-1
                                "
                            >
                                {unreadCount}
                            </span>
                        )}
                    </Button>

                    {/* MESSAGES */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/messages')}
                    >
                        <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7" strokeWidth={1.5} />
                    </Button>

                    {/* USER MENU */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                            >
                                <Avatar className="w-10 h-10 lg:w-12 lg:h-12">
                                    <AvatarImage
                                        src={user?.images?.[0]}
                                        alt={user?.name ?? 'Usuario'}
                                    />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {user?.name?.charAt(0) ?? 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate('/profile')}>
                                <User className="mr-2 w-4 h-4" />
                                Perfil
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => {
                                    handleLogout();
                                    window.location.href = "/login";
                                }}
                            >
                                Cerrar sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </nav>
    );
}