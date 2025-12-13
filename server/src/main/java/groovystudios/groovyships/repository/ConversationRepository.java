package groovystudios.groovyships.repository;

import groovystudios.groovyships.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository
        extends MongoRepository<Conversation, String> {

    List<Conversation> findByUserAIdOrUserBId(
            String userAId,
            String userBId
    );

    Optional<Conversation> findByUserAIdAndUserBId(
            String userAId,
            String userBId
    );
}
