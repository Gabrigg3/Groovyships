import { api } from "@/api/axiosConfig";

/* ================================
   TIPOS (IGUALES AL BACKEND)
================================ */

export type Gender = "hombre" | "mujer" | "otro";
export type LookingFor = "romance" | "amistad";

export type ProfileResponse = {
    id: string;
    name: string;
    age: number;
    gender: Gender;
    occupation: string;
    location: string;
    bio: string;

    lookingFor: LookingFor[];
    interestedInGenderRomance: Gender[];
    interestedInGenderFriendship: Gender[];

    ageRangeMin: number;
    ageRangeMax: number;

    interests: string[];
    photos: string[];
};

export type ProfileUpdateRequest = {
    name?: string;
    age?: number;
    gender?: Gender;
    occupation?: string;
    location?: string;
    bio?: string;

    lookingFor?: LookingFor[];
    interestedInGenderRomance?: Gender[];
    interestedInGenderFriendship?: Gender[];

    ageRangeMin?: number;
    ageRangeMax?: number;

    interests?: string[];
    photos?: string[];
};

/* ================================
   API
================================ */

export const profileApi = {
    /**
     * Obtener mi perfil
     * GET /api/profile/me
     */
    getMe(): Promise<ProfileResponse> {
        return api.get("/api/profile/me").then(res => res.data);
    },

    /**
     * Actualizar mi perfil
     * PUT /api/profile/me
     */
    updateMe(data: ProfileUpdateRequest): Promise<ProfileResponse> {
        return api.put("/api/profile/me", data).then(res => res.data);
    },


    deleteMe(): Promise<void> {
        const token = localStorage.getItem("accessToken");
        console.log("TOKEN EN DELETE:", token);

        return fetch("http://localhost:8080/api/profile/me", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (!res.ok) throw new Error("Error eliminando cuenta");
        });
    }

};
