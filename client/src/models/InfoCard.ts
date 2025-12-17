export type Gender = "hombre" | "mujer" | "otro";
export type LookingFor = "romance" | "amistad";

export interface InfoCard {
    id: string;

    name: string;
    age: number;
    gender: Gender;

    bio: string;
    images: string[];
    imageAlt: string;

    location: string;
    occupation: string;
    interests: string[];

    lookingFor: LookingFor[];
}