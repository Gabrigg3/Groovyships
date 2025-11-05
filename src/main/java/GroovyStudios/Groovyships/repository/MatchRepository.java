package GroovyStudios.Groovyships.repository;

import GroovyStudios.Groovyships.model.Match;
import GroovyStudios.Groovyships.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends MongoRepository<Match, Long> {

    List<Match> findByUser1OrUser2(User user1, User user2);

    Optional<Match> findByUser1AndUser2(User user1, User user2);


}