package GroovyStudios.Groovyships.repository;

import GroovyStudios.Groovyships.model.Match;
import GroovyStudios.Groovyships.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByUser1OrUser2(User user1, User user2);

    Optional<Match> findByUser1AndUser2(User user1, User user2);


}