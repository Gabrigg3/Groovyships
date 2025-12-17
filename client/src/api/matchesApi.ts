import { api } from "@/api/axiosConfig";
import type { Match } from "@/models/Match";
import type { InfoCard } from "@/models/InfoCard";

type MatchSuggestionDTO = {
    id: string;
    nombre: string;
    edad?: number;
    generoUsuario?: "hombre" | "mujer" | "otro";
    ubicacion?: string;
    biografia?: string;
    intereses?: string[];
    imagenes?: string[];
    ocupacion?: string;
    lookingFor?: ("romance" | "amistad")[];
};

const API_URL = "/api/v0/matches";

export const matchesApi = {
    async getSuggestions(userId: string): Promise<InfoCard[]> {
        const res = await api.get<MatchSuggestionDTO[]>(
            `${API_URL}/suggestions/${userId}`
        );

        return res.data.map((u) => ({
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
        }));
    },

    async like(userId: string, targetId: string): Promise<Match> {
        return (await api.post<Match>(`${API_URL}/${userId}/like/${targetId}`)).data;
    },

    async dislike(userId: string, targetId: string): Promise<Match> {
        return (await api.post<Match>(`${API_URL}/${userId}/dislike/${targetId}`)).data;
    },
};