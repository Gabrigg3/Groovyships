type Gender = "hombre" | "mujer" | "otro";
type LookingFor = "romance" | "amistad";

export interface Profile {
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
}
