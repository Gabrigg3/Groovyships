import { apiHttp } from "@/api/axiosConfig";
import type { InfoCard } from "@/models/InfoCard";

const API_URL = "/api/v0/usuarios";

export const usersApi = {
    async getById(userId: string): Promise<InfoCard> {
        const res = await apiHttp.get<any>(`${API_URL}/${userId}`);
        const u = res.data;

        return {
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
        };
    },
};
