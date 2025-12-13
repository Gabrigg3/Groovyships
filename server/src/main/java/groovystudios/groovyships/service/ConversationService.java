package groovystudios.groovyships.service;

import groovystudios.groovyships.dto.ConversationResponse;
import groovystudios.groovyships.model.Conversation;
import groovystudios.groovyships.model.Message;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.repository.ConversationRepository;
import groovystudios.groovyships.repository.MessageRepository;
import groovystudios.groovyships.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepo;
    private final MessageRepository messageRepo;
    private final UserRepository userRepo;

    public ConversationService(
            ConversationRepository conversationRepo,
            MessageRepository messageRepo,
            UserRepository userRepo
    ) {
        this.conversationRepo = conversationRepo;
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
    }

    public List<ConversationResponse> getUserConversations(String userId) {

        List<Conversation> conversations =
                conversationRepo.findByUserAIdOrUserBId(userId, userId);

        return conversations.stream().map(conversation -> {

            String otherUserId =
                    conversation.getUserAId().equals(userId)
                            ? conversation.getUserBId()
                            : conversation.getUserAId();

            User otherUser = userRepo.findById(otherUserId).orElseThrow();

            Message lastMessage =
                    messageRepo
                            .findTopByConversationIdOrderBySentAtDesc(conversation.getId())
                            .orElse(null);

            return new ConversationResponse(
                    conversation.getId(),
                    otherUser.getId(),
                    otherUser.getNombre(),
                    otherUser.getImagenes().isEmpty()
                            ? null
                            : otherUser.getImagenes().get(0),
                    lastMessage != null ? lastMessage.getContent() : null,
                    lastMessage != null ? lastMessage.getSentAt() : null
            );
        }).toList();
    }


    public Conversation getConversationById(String conversationId, String user) {

        Conversation conversation = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversación no encontrada"));

        boolean isParticipant =
                conversation.getUserAId().equals(user) ||
                        conversation.getUserBId().equals(user);

        if (!isParticipant) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes acceso a esta conversación");
        }

        return conversation;
    }
}
