import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Star, UserPlus, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useNotificationStore } from "@/store/notificationStore";
import type { Notification } from "@/models/Notification";

/* ---------------------------------------
   UI HELPERS (MISMA ESTÉTICA)
--------------------------------------- */
function getNotificationIcon(type: Notification["type"]) {
    switch (type) {
        case "MATCH":
            return (
                <Heart
                    className="w-6 h-6 text-primary"
                    strokeWidth={2}
                    fill="currentColor"
                />
            );
        case "MESSAGE":
            return (
                <MessageCircle
                    className="w-6 h-6 text-tertiary"
                    strokeWidth={2}
                />
            );
        case "LIKE":
            return (
                <Heart
                    className="w-6 h-6 text-secondary"
                    strokeWidth={2}
                />
            );
        default:
            return (
                <Clock
                    className="w-6 h-6 text-muted-foreground"
                    strokeWidth={2}
                />
            );
    }
}

function getNotificationBgColor(type: Notification["type"]) {
    switch (type) {
        case "MATCH":
            return "bg-primary/10";
        case "MESSAGE":
            return "bg-tertiary/10";
        case "LIKE":
            return "bg-secondary/10";
        default:
            return "bg-muted";
    }
}

/* ---------------------------------------
   COMPONENT
--------------------------------------- */
export function Notifications() {
    const navigate = useNavigate();

    const notifications = useNotificationStore((s) => s.notifications);
    const unreadCount = useNotificationStore((s) => s.unreadCount);
    const markAsRead = useNotificationStore((s) => s.markAsRead);

    const handleNotificationClick = (n: Notification) => {
        markAsRead(n.id);

        if (n.type === "MATCH" || n.type === "MESSAGE") {
            navigate("/messages");
        }
    };

    return (
        <div className="pt-16 lg:pt-20 min-h-screen bg-background">
            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 max-w-4xl">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8 lg:mb-12">
                    <h1 className="text-foreground text-3xl lg:text-4xl font-bold font-sans">
                        Notificaciones
                    </h1>

                    {unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold font-body">
                            {unreadCount} nuevas
                        </span>
                    )}
                </div>

                {/* LIST */}
                <div className="space-y-4">
                    {notifications.map((n) => {
                        const profile = n.payload?.profile;

                        return (
                            <Card
                                key={n.id}
                                onClick={() => handleNotificationClick(n)}
                                className={`bg-card text-card-foreground border-border p-4 lg:p-6 transition-all duration-200 ${
                                    n.type === "MATCH" || n.type === "MESSAGE"
                                        ? "cursor-pointer hover:border-primary"
                                        : ""
                                } ${!n.read ? "border-l-4 border-l-primary" : ""}`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* ICON */}
                                    <div
                                        className={`${getNotificationBgColor(
                                            n.type
                                        )} rounded-full p-3 flex-shrink-0`}
                                    >
                                        {getNotificationIcon(n.type)}
                                    </div>

                                    {/* AVATAR */}
                                    <Avatar className="w-14 h-14 lg:w-16 lg:h-16 flex-shrink-0">
                                        <AvatarImage
                                            src={profile?.imagenes?.[0] ?? ""}
                                            alt={profile?.nombre ?? ""}
                                        />
                                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                            {profile?.nombre?.[0] ?? "?"}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* CONTENT */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p
                                                className={`text-base lg:text-lg font-body ${
                                                    !n.read
                                                        ? "text-foreground font-semibold"
                                                        : "text-muted-foreground"
                                                }`}
                                            >
                                                {n.type === "MATCH" &&
                                                    `Has hecho match con ${profile?.nombre}`}
                                                {n.type === "MESSAGE" &&
                                                    "Has recibido un nuevo mensaje"}
                                                {n.type === "LIKE" &&
                                                    `${profile?.nombre} le dio like a tu perfil`}
                                            </p>

                                            {!n.read && (
                                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-body">
                                            <Clock className="w-4 h-4" strokeWidth={1.5} />
                                            <span>
                                                {new Date(n.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* ACTION BUTTON */}
                                        {(n.type === "MATCH" ||
                                            n.type === "MESSAGE") && (
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate("/messages");
                                                }}
                                                className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90"
                                                size="sm"
                                            >
                                                Ver mensaje
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* EMPTY */}
                {notifications.length === 0 && (
                    <Card className="bg-card text-card-foreground border-border p-12 text-center mt-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-muted rounded-full p-6">
                                <Clock
                                    className="w-12 h-12 text-muted-foreground"
                                    strokeWidth={1.5}
                                />
                            </div>
                            <h3 className="text-foreground text-xl font-bold font-sans">
                                No hay notificaciones
                            </h3>
                            <p className="text-muted-foreground font-body">
                                Cuando alguien te de like o te envíe un mensaje,
                                aparecerá aquí
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
