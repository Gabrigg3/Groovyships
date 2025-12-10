export interface UserLight {
    id: string;
    nombre: string;

    edad?: number;
    ubicacion?: string;
    biografia?: string;
    intereses?: string[];

    //Fotos del backend → imagenes (lista de URLs)
    imagenes?: string[];

    //Ocupación del usuario
    ocupacion?: string;

    //Preferencias del usuario
    lookingFor?: ("romance" | "amistad" | "ambos")[];
}