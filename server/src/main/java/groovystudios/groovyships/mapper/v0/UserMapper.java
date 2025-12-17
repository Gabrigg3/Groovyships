package groovystudios.groovyships.mapper.v0;


import groovystudios.groovyships.dto.v0.UserResponse;
import groovystudios.groovyships.model.User;

public class UserMapper {

    public static UserResponse toResponse(User user) {
        if (user == null) return null;

        return new UserResponse(
                user.getId(),
                user.getNombre(),
                user.getEdad(),
                user.getBiografia(),
                user.getUbicacion(),
                user.getOcupacion(),
                user.getGeneroUsuario(),
                user.getImagenes(),
                user.getIntereses(),
                user.getLookingFor(),
                user.getRangoEdad(),
                user.getGenerosRomance(),
                user.getGenerosAmistad()
        );
    }
}