package GroovyStudios.Groovyships.repository;
import GroovyStudios.Groovyships.model.Message;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Document(collection = "messages")
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByMatchIdOrderBySentAtAsc(String matchId);
}
