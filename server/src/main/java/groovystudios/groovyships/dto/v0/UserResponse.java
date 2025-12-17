package groovystudios.groovyships.dto.v0;

import java.util.List;

public record UserResponse(
        String id,
        String nombre,
        Integer edad,
        String biografia,
        String ubicacion,
        String ocupacion,
        String generoUsuario,
        List<String> imagenes,
        List<String> intereses,
        List<String> lookingFor,
        List<Integer> rangoEdad,
        List<String> generosRomance,
        List<String> generosAmistad
) {}
