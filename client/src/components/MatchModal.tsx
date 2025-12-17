import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { InfoCard } from "@/models/InfoCard";

interface MatchModalProps {
    currentUser: InfoCard;
    matchedUser: InfoCard;
    onClose: () => void;
}

export function MatchModal({ currentUser, matchedUser, onClose }: MatchModalProps) {
    const navigate = useNavigate();

    const handleStartChat = () => {
        onClose();
        navigate(`/messages/${matchedUser.id}`);
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
                    <Heart className="w-24 h-24 text-white mb-6" fill="white" />

                    <h2 className="text-white text-3xl font-bold mb-4">
                        ¡Es un Match!
                    </h2>

                    <p className="text-white text-lg mb-6">
                        Tú y {matchedUser.name} os disteis like mutuamente 💖
                    </p>

                    {/* Fotos */}
                    <div className="flex gap-6 mb-8">
                        <img
                            src={currentUser.images?.[0] ?? "/placeholder.png"}
                            alt="Tu perfil"
                            className="w-24 h-24 rounded-full border-4 border-white object-cover"
                        />
                        <img
                            src={matchedUser.images?.[0] ?? "/placeholder.png"}
                            alt={matchedUser.name}
                            className="w-24 h-24 rounded-full border-4 border-white object-cover"
                        />
                    </div>

                    <Button
                        onClick={handleStartChat}
                        className="w-full bg-white text-primary font-semibold py-6"
                    >
                        Iniciar Chat
                    </Button>

                    <Button
                        onClick={onClose}
                        className="mt-4 w-full bg-white/10 text-white py-4"
                    >
                        Seguir explorando
                    </Button>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}