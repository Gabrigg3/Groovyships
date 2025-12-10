import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart, X } from "lucide-react";
import type { UserLight } from "@/models/UserLight";

interface SwipeCardProps {
    profile: UserLight;
    onLike: () => void;
    onDislike: () => void;
}

export function SwipeCard({ profile, onLike, onDislike }: SwipeCardProps) {
    const [exitX, setExitX] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x > 100) {
            setExitX(200);
            onLike();
        } else if (info.offset.x < -100) {
            setExitX(-200);
            onDislike();
        }
    };

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!profile.imagenes?.length) return;
        setCurrentImageIndex((prev) => (prev + 1) % profile.imagenes!.length);
    };

    const getBadge = (type: string) => {
        if (type === "romance") return { emoji: "💕", label: "Romance", color: "bg-gradient-1" };
        if (type === "amistad") return { emoji: "🤝", label: "Amistad", color: "bg-gradient-friendship" };
        return null;
    };

    return (
        <motion.div
            style={{ x, y, rotate, opacity }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            animate={exitX !== 0 ? { x: exitX } : {}}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md relative cursor-grab active:cursor-grabbing"
        >
            <Card className="overflow-hidden bg-card border-0 relative">
                <div className="relative aspect-[3/4]">

                    {/* Indicadores de imagen */}
                    <div className="absolute top-4 left-0 right-0 flex gap-2 px-4 z-10">
                        {profile.imagenes?.map((_, index) => (
                            <div
                                key={index}
                                className={`flex-1 h-1 rounded-full transition-all ${
                                    index === currentImageIndex ? "bg-white" : "bg-white/30"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Imagen */}
                    <img
                        src={profile.imagenes?.[currentImageIndex] || "/placeholder.png"}
                        alt={profile.nombre}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={handleImageClick}
                    />

                    {/* Indicador LIKE */}
                    <motion.div
                        style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
                        className="absolute top-8 right-8 bg-tertiary text-tertiary-foreground rounded-full p-4"
                    >
                        <Heart className="w-12 h-12" strokeWidth={2} fill="currentColor" />
                    </motion.div>

                    {/* Indicador DISLIKE */}
                    <motion.div
                        style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
                        className="absolute top-8 left-8 bg-destructive text-destructive-foreground rounded-full p-4"
                    >
                        <X className="w-12 h-12" strokeWidth={2} />
                    </motion.div>

                    {/* Overlay inferior */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 to-transparent p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {profile.lookingFor?.map((type) => {
                                const badge = getBadge(type);
                                return (
                                    badge && (
                                        <span
                                            key={type}
                                            className={`${badge.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                                        >
                                            {badge.emoji} {badge.label}
                                        </span>
                                    )
                                );
                            })}
                        </div>

                        <h2 className="text-white text-3xl font-bold">
                            {profile.nombre}, {profile.edad}
                        </h2>

                        <p className="text-white/90 text-base">{profile.biografia}</p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}