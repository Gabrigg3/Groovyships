import { useEffect, useState } from "react";
import {
    motion,
    useMotionValue,
    useTransform,
    AnimatePresence,
} from "framer-motion";
import { Card } from "@/components/ui/card";
import { InfoCard } from "@/models/InfoCard";
import { Heart, X, MapPin, Briefcase } from "lucide-react";

interface SwipeCardProps {
    profile: InfoCard;
    onLike: () => void;
    onDislike: () => void;
}

export function SwipeCard({ profile, onLike, onDislike }: SwipeCardProps) {
    const [currentImage, setCurrentImage] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [exitX, setExitX] = useState<number | null>(null);
    const [locked, setLocked] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotate = useTransform(x, [-200, 200], [-20, 20]);
    const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0]);
    const likeOpacity = useTransform(x, [40, 120], [0, 1]);
    const dislikeOpacity = useTransform(x, [-120, -40], [1, 0]);

    /* ================================
       RESET WHEN PROFILE CHANGES
    ================================= */
    useEffect(() => {
        setCurrentImage(0);
        setShowDetails(false);
        setExitX(null);
        setLocked(false);
        x.set(0);
        y.set(0);
    }, [profile.id, x, y]);

    /* ================================
       DRAG END LOGIC
    ================================= */
    const handleDragEnd = (_: any, info: any) => {
        if (locked) return;

        const { offset } = info;

        if (offset.y < -120 && Math.abs(offset.x) < 80) {
            setShowDetails(true);
            x.set(0);
            y.set(0);
            return;
        }

        if (offset.x > 140) {
            setLocked(true);
            setExitX(300);
            onLike();
            return;
        }

        if (offset.x < -140) {
            setLocked(true);
            setExitX(-300);
            onDislike();
            return;
        }

        x.set(0);
        y.set(0);
    };

    /* ================================
       IMAGE TAP
    ================================= */
    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (profile.images.length === 0) return;
        setCurrentImage((prev) => (prev + 1) % profile.images.length);
    };

    const genderLabels: Record<"hombre" | "mujer" | "otro", string> = {
        hombre: "👨 Hombre",
        mujer: "👩 Mujer",
        otro: "🌈 Otro",
    };

    const badges = {
        romance: { emoji: "💕", label: "Romance", color: "bg-gradient-1" },
        amistad: { emoji: "🤝", label: "Amistad", color: "bg-gradient-friendship" },
    };

    return (
        <>
            <motion.div
                style={{ x, y, rotate, opacity }}
                drag
                dragElastic={0.35}
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                animate={exitX ? { x: exitX } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-full max-w-md cursor-grab active:cursor-grabbing"
            >
                <Card className="overflow-hidden border-0 bg-card relative">
                    <div className="relative aspect-[3/4]">

                        {/* Image indicators */}
                        <div className="absolute top-4 left-0 right-0 flex gap-2 px-4 z-10">
                            {profile.images.map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 h-1 rounded-full ${
                                        i === currentImage ? "bg-white" : "bg-white/30"
                                    }`}
                                />
                            ))}
                        </div>

                        <img
                            src={profile.images[currentImage]}
                            alt={profile.imageAlt}
                            className="w-full h-full object-cover"
                            onClick={handleImageClick}
                        />

                        {/* Like */}
                        {/* Like */}
                        <motion.div
                            style={{ opacity: likeOpacity }}
                            className="absolute top-8 right-8 bg-primary text-white rounded-full p-4"
                        >
                            <Heart className="w-10 h-10" fill="currentColor" />
                        </motion.div>

                        {/* Dislike */}
                        <motion.div
                            style={{ opacity: dislikeOpacity }}
                            className="absolute top-8 left-8 bg-destructive text-white rounded-full p-4"
                        >
                            <X className="w-10 h-10" />
                        </motion.div>

                        {/* Overlay */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                            <div className="flex gap-2 mb-3">
                                {profile.lookingFor.map((t) => (
                                    <span
                                        key={t}
                                        className={`${badges[t].color} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                                    >
                                        {badges[t].emoji} {badges[t].label}
                                    </span>
                                ))}
                            </div>

                            <h2 className="text-white text-3xl font-bold">
                                {profile.name}, {profile.age}
                            </h2>

                            <p className="text-white/90 mt-2 line-clamp-2">
                                {profile.bio}
                            </p>

                            <p className="text-white/70 text-sm text-center mt-4">
                                ⬆️ Desliza hacia arriba para ver más
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* ================================
               DETAILS MODAL
            ================================= */}
            <AnimatePresence>
                {showDetails && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDetails(false)}
                    >
                        <motion.div
                            className="w-full max-w-2xl bg-card rounded-t-3xl max-h-[90vh] overflow-y-auto"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", stiffness: 260, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-card border-b p-4 flex justify-between">
                                <h3 className="text-xl font-bold">
                                    {profile.name}, {profile.age}
                                </h3>
                                <button onClick={() => setShowDetails(false)}>
                                    <X />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Gallery */}
                                <div className="grid grid-cols-3 gap-2">
                                    {profile.images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            className="aspect-square object-cover rounded-lg"
                                        />
                                    ))}
                                </div>

                                {/* GÉNERO */}
                                <div className="flex items-center gap-3 bg-muted p-4 rounded-lg">
                                    <span className="text-primary text-lg">👤</span>
                                    <span className="font-semibold">
                                        {genderLabels[profile.gender]}
                                    </span>
                                </div>

                                {/* Bio */}
                                <section>
                                    <h4 className="font-bold mb-2">Sobre mí</h4>
                                    <p>{profile.bio}</p>
                                </section>

                                {/* Info */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex gap-3 bg-muted p-4 rounded-lg">
                                        <MapPin className="text-primary" />
                                        {profile.location}
                                    </div>
                                    <div className="flex gap-3 bg-muted p-4 rounded-lg">
                                        <Briefcase className="text-primary" />
                                        {profile.occupation}
                                    </div>
                                </div>

                                {/* Interests */}
                                <div>
                                    <h4 className="font-bold mb-2">Intereses</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.interests.map((i) => (
                                            <span
                                                key={i}
                                                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                                            >
                                                {i}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}