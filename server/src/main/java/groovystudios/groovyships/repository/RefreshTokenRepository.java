package groovystudios.groovyships.repository;

import groovystudios.groovyships.model.RefreshToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

//Para gestionar los RefreshTokens
public interface RefreshTokenRepository extends MongoRepository<RefreshToken, String> {

    Optional<RefreshToken> findByToken(String token); //Buscar un token por su cadena opaca

    void deleteByUserId(String userId); //Eliminar tokens asociados a un usuario específico

}

