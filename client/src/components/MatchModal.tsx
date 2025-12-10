import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UserLight } from "@/models/UserLight";

interface MatchModalProps {
    profile: UserLight;
    onClose: () => void;
}

export function MatchModal({ profile, onClose }: MatchModalProps) {
    const navigate = useNavigate();

    const handleStartChat = () => {
        onClose();
        navigate(`/messages/${profile.id}`);
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="bg-gradient-1 border-0 max-w-md p-8 lg:p-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center text-center"
                >
                    {/* Icono corazón */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mb-6 lg:mb-8"
                    >
                        <Heart
                            className="w-20 h-20 lg:w-24 lg:h-24 text-white"
                            strokeWidth={2}
                            fill="white"
                        />
                    </motion.div>

                    <h2 className="text-white text-3xl lg:text-4xl font-bold mb-4">
                        ¡Es un Match!
                    </h2>

                    <p className="text-white text-lg lg:text-xl mb-4">
                        Tú y {profile.nombre} os disteis like mutuamente 💖
                    </p>

                    {/* Badges de intereses */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8 lg:mb-10">
                        {profile.lookingFor?.map((type) => {
                            const badgeInfo = {
                                romance: { emoji: "💕", label: "Romance" },
                                amistad: { emoji: "🤝", label: "Amistad" }
                            }[type];

                            if (!badgeInfo) return null;

                            return (
                                <span
                                    key={type}
                                    className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold"
                                >
                                    {badgeInfo.emoji} {badgeInfo.label}
                                </span>
                            );
                        })}
                    </div>

                    {/* Fotos del match */}
                    <div className="flex items-center justify-center gap-6 mb-8 lg:mb-10">
                        {/* Foto del usuario logueado (placeholder por ahora) */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white"
                        >
                            <img
                                src="https://c.animaapp.com/miuehdn2n7lalI/img/ai_1.png"
                                alt="your profile"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Foto de la persona con la que hiciste match */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white"
                        >
                            <img
                                src={profile.imagenes?.[0] ?? "/placeholder.png"}
                                alt={profile.nombre}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>

                    {/* Botón iniciar chat */}
                    <Button
                        onClick={handleStartChat}
                        className="w-full bg-white text-primary hover:bg-gray-100 font-semibold text-lg py-6"
                    >
                        Iniciar Chat
                    </Button>

                    {/* Botón seguir explorando */}
                    <Button
                        onClick={onClose}
                        className="mt-4 text-white bg-white/10 hover:bg-white/20 font-semibold w-full py-4"
                    >
                        Seguir Explorando
                    </Button>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}