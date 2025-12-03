package groovystudios.groovyships.repository;
import GroovyStudios.Groovyships.model.Message;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


@Document(collection = "messages")
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByMatchIdOrderBySentAtAsc(String matchId);
}
