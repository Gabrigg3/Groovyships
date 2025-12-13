export interface UserLight {
    id: string;
    nombre: string;

    edad?: number;
    ubicacion?: string;
    biografia?: string;
    intereses?: string[];

    // Fotos del backend → imagenes (lista de URLs)
    imagenes?: string[];

    // Ocupación del usuario
    ocupacion?: string;

    // Preferencias generales
    lookingFor?: ("romance" | "amistad")[];

    // Género del propio usuario
    generoUsuario?: "hombre" | "mujer" | "otro";

    // Géneros que le interesan para romance
    generosRomance?: ("hombre" | "mujer" | "otro")[];

    // Géneros que le interesan para amistad
    generosAmistad?: ("hombre" | "mujer" | "otro")[];

    // Rango de edad preferido [min, max]
    rangoEdad?: [number, number];
}