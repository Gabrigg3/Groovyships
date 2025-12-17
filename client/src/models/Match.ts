import type { InfoCard } from "./InfoCard";

export interface Match {
    id: string;
    usuario: InfoCard;
    target: InfoCard;
    status: "LIKE" | "DISLIKE" | "null";
    fechaMatch: string;
}