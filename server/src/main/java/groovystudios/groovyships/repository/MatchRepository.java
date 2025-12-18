package groovystudios.groovyships.repository;

import groovystudios.groovyships.model.Match;
import groovystudios.groovyships.model.User;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends MongoRepository<Match, String> {

    //Buscar todos los matches donde el usuario es usuario1 o usuario2
    List<Match> findByUsuarioOrTarget(User usuario, User target);

    //Buscar un match específico entre dos usuarios
    Optional<Match> findByUsuarioAndTarget(User usuario, User target);

    void deleteByUsuarioAndTarget(User usuario, User target);

}