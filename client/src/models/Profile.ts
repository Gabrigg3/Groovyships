import {useAuthStore} from "@/store/authStore";

export type LookingFor = "romance" | "amistad";

export interface Profile {
    id: string;
    name: string;
    age: number;
    bio: string;
    images: string[];
    imageAlt: string;
    location: string;
    occupation: string;
    interests: string[];
    lookingFor: LookingFor[];
}