package groovystudios.groovyships.dto.v0;

public record AuthResponse(
        String accessToken,
        String userId
) {}