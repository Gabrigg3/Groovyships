import { useEffect, useState } from "react";
import { SwipeCard } from "@/components/SwipeCard";
import { ActionButtons } from "@/components/ActionButtons";
import { MatchModal } from "@/components/MatchModal";
import { matchesApi } from "@/api/matchesApi";
import type { UserLight } from "@/models/UserLight";
import { useAuthStore } from "@/store/authStore";

export function SwipeDeck() {

    const userId = useAuthStore((s) => s.userId);

    if (!userId) {
        console.log("NO HAY USERID, esperando a login...");
        return null;
    }

    const [profiles, setProfiles] = useState<UserLight[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [matchedProfile, setMatchedProfile] = useState<UserLight | null>(null);
    const [filter, setFilter] = useState<"todos" | "romance" | "amistad">("todos");

    // ---------------------------------------
    // Cargar sugerencias al montar
    // ---------------------------------------
    useEffect(() => {
        matchesApi
            .getSuggestions(userId)
            .then(setProfiles)
            .catch((e) => console.error("Error cargando sugerencias:", e));
    }, [userId]);

    // ---------------------------------------
    // Aplicar filtro
    // ---------------------------------------
    const filtered = profiles.filter((p) =>
        filter === "todos" ? true : p.lookingFor?.includes(filter)
    );

    const current = filtered[currentIndex];

    // ---------------------------------------
    // Eliminar perfil actual de la lista
    // ---------------------------------------
    const removeCurrentProfile = () => {
        if (!current) return;

        setProfiles((prev) => prev.filter((p) => p.id !== current.id));
        setCurrentIndex(0); // evitar desbordes
    };

    // ---------------------------------------
    // LIKE
    // ---------------------------------------
    const handleLike = async () => {
        if (!current) return;

        try {
            const match = await matchesApi.like(userId, current.id);

            // Es match real
            if (match.target?.id === current.id && match.usuario?.id === userId) {
                setMatchedProfile(current);
                setShowMatchModal(true);
            }
        } catch (e) {
            console.error("Error enviando like:", e);
        }

        removeCurrentProfile();
    };

    // ---------------------------------------
    // DISLIKE
    // ---------------------------------------
    const handleDislike = async () => {
        if (!current) return;

        try {
            await matchesApi.dislike(userId, current.id);
        } catch (e) {
            console.error("Error enviando dislike:", e);
        }

        removeCurrentProfile();
    };

    return (
        <div className="pt-16 lg:pt-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-8 max-w-2xl">

                {/* Filtros */}
                <div className="flex justify-center gap-4 mb-8">
                    {[
                        { key: "todos", label: "🌟 Todos" },
                        { key: "romance", label: "💕 Romance" },
                        { key: "amistad", label: "🤝 Amistad" },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => {
                                setFilter(f.key as any);
                                setCurrentIndex(0);
                            }}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${
                                filter === f.key
                                    ? "bg-primary text-white shadow-lg scale-105"
                                    : "bg-white border hover:border-primary"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6">
                    {current ? (
                        <>
                            <SwipeCard
                                profile={current}
                                onLike={handleLike}
                                onDislike={handleDislike}
                            />

                            <ActionButtons
                                onLike={handleLike}
                                onDislike={handleDislike}
                                onSuperLike={handleLike}
                            />
                        </>
                    ) : (
                        <p className="text-muted-foreground text-center mt-12">
                            No hay más perfiles disponibles 😊
                        </p>
                    )}
                </div>
            </div>

            {showMatchModal && matchedProfile && (
                <MatchModal
                    profile={matchedProfile}
                    onClose={() => setShowMatchModal(false)}
                />
            )}
        </div>
    );
}