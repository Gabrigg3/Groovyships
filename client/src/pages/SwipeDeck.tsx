import { useEffect, useState } from "react";
import { SwipeCard } from "@/components/SwipeCard";
import { ActionButtons } from "@/components/ActionButtons";
import { MatchModal } from "@/components/MatchModal";
import { matchesApi } from "@/api/matchesApi";
import { usersApi } from "@/api/userApi";
import { useAuthStore } from "@/store/authStore";
import type { InfoCard, LookingFor } from "@/models/InfoCard";

export function SwipeDeck() {
    const userId = useAuthStore((s) => s.userId);
    if (!userId) return null;

    const [cards, setCards] = useState<InfoCard[]>([]);
    const [currentUser, setCurrentUser] = useState<InfoCard | null>(null);
    const [matchedProfile, setMatchedProfile] = useState<InfoCard | null>(null);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [filter, setFilter] = useState<"todos" | LookingFor>("todos");

    /* ================================
       LOAD LOGGED USER
    ================================ */
    useEffect(() => {
        usersApi.getById(userId).then((u) =>
            setCurrentUser({
                id: u.id,
                name: u.nombre,
                age: u.edad ?? 18,
                gender: u.generoUsuario ?? "otro",
                bio: u.biografia ?? "",
                images: u.imagenes ?? [],
                imageAlt: u.nombre,
                location: u.ubicacion ?? "—",
                occupation: u.ocupacion ?? "—",
                interests: u.intereses ?? [],
                lookingFor: u.lookingFor ?? [],
            })
        );
    }, [userId]);

    /* ================================
       LOAD SUGGESTIONS
    ================================ */
    useEffect(() => {
        matchesApi.getSuggestions(userId).then(setCards);
    }, [userId]);

    const filteredCards = cards.filter((c) =>
        filter === "todos" ? true : c.lookingFor.includes(filter)
    );

    const current = filteredCards[0];

    const removeCurrent = () =>
        setCards((prev) => prev.filter((c) => c.id !== current?.id));

    const handleLike = async () => {
        if (!current) return;

        const match = await matchesApi.like(userId, current.id);

        if (match.target?.id === current.id && currentUser) {
            setMatchedProfile(current);
            setShowMatchModal(true);
        }

        removeCurrent();
    };

    const handleDislike = async () => {
        if (!current) return;
        await matchesApi.dislike(userId, current.id);
        removeCurrent();
    };

    return (
        <>
            {current && (
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
            )}

            {showMatchModal && matchedProfile && currentUser && (
                <MatchModal
                    currentUser={currentUser}
                    matchedUser={matchedProfile}
                    onClose={() => setShowMatchModal(false)}
                />
            )}
        </>
    );
}