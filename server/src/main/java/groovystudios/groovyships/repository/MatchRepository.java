package groovystudios.groovyships.repository;

import GroovyStudios.Groovyships.model.Match;
import GroovyStudios.Groovyships.model.User;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

@Document(collection = "matches")
public interface MatchRepository extends MongoRepository<Match, String> {

    List<Match> findByUsuarioOrTarget(User usuario, User target);

    Optional<Match> findByUsuarioAndTarget(User usuario, User target);


}