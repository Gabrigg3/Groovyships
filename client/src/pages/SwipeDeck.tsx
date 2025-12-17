import {useEffect, useMemo, useState} from "react";
import { SwipeCard } from "@/components/SwipeCard";
import { ActionButtons } from "@/components/ActionButtons";
import { matchesApi } from "@/api/matchesApi";
import { useAuthStore } from "@/store/authStore";
import type { InfoCard, LookingFor } from "@/models/InfoCard";

export function SwipeDeck() {
    const userId = useAuthStore((s) => s.userId);

    const [cards, setCards] = useState<InfoCard[]>([]);
    const [filter, setFilter] = useState<"todos" | LookingFor>("todos");
    const [loading, setLoading] = useState(false);

    /* ================================
       LOAD SUGGESTIONS
    ================================= */
    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        matchesApi
            .getSuggestions(userId)
            .then(setCards)
            .finally(() => setLoading(false));
    }, [userId]);

    /* ================================
       FILTERED DECK
    ================================= */
    const filteredCards = useMemo(() => {
        return filter === "todos"
            ? cards
            : cards.filter((c) => c.lookingFor.includes(filter));
    }, [cards, filter]);

    const current = filteredCards[0] ?? null;

    const removeCurrent = () => {
        if (!current) return;
        setCards((prev) => prev.filter((c) => c.id !== current.id));
    };

    /* ================================
       ACTIONS
    ================================= */
    const [processing, setProcessing] = useState(false);

    const handleLike = async () => {
        if (!current || !userId || processing) return;

        setProcessing(true);
        try {
            await matchesApi.like(userId, current.id);
        } finally {
            removeCurrent();
            setProcessing(false);
        }
    };



    const handleDislike = async () => {
        if (!current || !userId || processing) return;

        setProcessing(true);
        try {
            await matchesApi.dislike(userId, current.id);
        } finally {
            removeCurrent();
            setProcessing(false);
        }
    };


    /* ================================
       RENDER
    ================================= */
    if (!userId) {
        return null; // aquí sí, porque no debería pasar
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
                Cargando perfiles...
            </div>
        );
    }



    return (
        <div className="pt-16 lg:pt-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-2xl">

                {/* FILTERS (si los tienes) */}
                {/*
            <div className="flex flex-wrap justify-center gap-3 mb-6 lg:mb-8">
                ...
            </div>
            */}

                <div className="flex flex-col items-center gap-6 lg:gap-8">
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
                        <p className="text-center text-muted-foreground mt-8">
                            No hay más perfiles disponibles
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}