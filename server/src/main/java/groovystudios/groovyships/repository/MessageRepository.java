package groovystudios.groovyships.repository;
import groovystudios.groovyships.model.Message;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


@Document(collection = "messages")
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByMatchIdOrderBySentAtAsc(String matchId); //Buscar mensajes por ID de match, ordenados por fecha de envío ascendente
}
