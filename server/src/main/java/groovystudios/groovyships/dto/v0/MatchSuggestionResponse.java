package groovystudios.groovyships.dto.v0;

import java.util.List;

public record MatchSuggestionResponse(
        String id,
        String nombre,
        Integer edad,
        String generoUsuario,
        String ubicacion,
        String biografia,
        List<String> intereses,
        List<String> imagenes,
        String ocupacion,
        List<String> lookingFor
) {}

