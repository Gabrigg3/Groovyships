package groovystudios.groovyships.dto.v0;

import java.util.List;

public record RegisterRequest(
        String nombre,
        String email,
        Integer telefono,
        String password,

        Integer edad,
        String ocupacion,
        String ubicacion,
        String biografia,
        String generoUsuario,

        List<String> imagenes,
        List<String> intereses,

        List<String> lookingFor,
        List<String> generosRomance,
        List<String> generosAmistad,
        List<Integer> rangoEdad
) {}
