package groovystudios.groovyships.service;

import groovystudios.groovyships.dto.v0.NotificationEvent;
import groovystudios.groovyships.dto.v0.MessageEvent;
import groovystudios.groovyships.dto.v0.MessageResponse;
import groovystudios.groovyships.model.Conversation;
import groovystudios.groovyships.model.Message;
import groovystudios.groovyships.model.MessageType;
import groovystudios.groovyships.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationService conversationService;
    private final WebSocketService webSocketService;

    public MessageService(
            MessageRepository messageRepository,
            ConversationService conversationService,
            WebSocketService webSocketService
    ) {
        this.messageRepository = messageRepository;
        this.conversationService = conversationService;
        this.webSocketService = webSocketService;
    }

    // --------------------------------------------------
    // ENVIAR MENSAJE + EMITIR WEBSOCKET
    // --------------------------------------------------
    public Message sendMessage(
            String conversationId,
            String senderId,
            MessageType type,
            String content
    ) {
        // 🔒 Validar acceso a la conversación
        Conversation conversation = conversationService.getConversationById(conversationId, senderId);

        // 🛑 Validaciones básicas
        if (type == null) {
            throw new RuntimeException("Tipo de mensaje obligatorio");
        }

        if (content == null || content.isBlank()) {
            throw new RuntimeException("El contenido no puede estar vacío");
        }

        // 💾 Guardar mensaje
        Message message = new Message(
                conversationId,
                senderId,
                type,
                content
        );

        Message saved = messageRepository.save(message);

        // 🔁 Emitir mensaje en tiempo real
        MessageResponse response = MessageResponse.from(saved);

        webSocketService.sendMessageToConversation(
                conversationId,
                new MessageEvent(conversationId, response)
        );

        // 🔔 Notificación al otro usuario
        String otherUserId = conversation.getUserAId().equals(senderId)
                ? conversation.getUserBId()
                : conversation.getUserAId();

        webSocketService.sendNotificationToUser(
                otherUserId,
                new NotificationEvent(
                        "MESSAGE",
                        "Nuevo mensaje",
                        "Tienes un nuevo mensaje"
                )
        );

        return saved;
    }

    // --------------------------------------------------
    // OBTENER MENSAJES (REST)
    // --------------------------------------------------
    public List<Message> getMessages(String conversationId, String userId) {

        // 🔒 Validar acceso
        conversationService.getConversationById(
                conversationId,
                userId
        );

        return messageRepository.findByConversationIdOrderBySentAtAsc(conversationId);
    }
}
