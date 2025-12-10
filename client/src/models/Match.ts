import type { UserLight } from "./UserLight";

export interface Match {
    id: string;
    usuario: UserLight;
    target: UserLight;
    status: "LIKE" | "DISLIKE" | "null";
    fechaMatch: string;
}