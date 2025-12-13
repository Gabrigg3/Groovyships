package groovystudios.groovyships.dto;

import groovystudios.groovyships.model.Message;
import groovystudios.groovyships.model.MessageType;

import java.time.LocalDateTime;

public class MessageResponse {

    private String id;
    private String conversationId;
    private String senderId;

    private MessageType type;
    private String content;

    private LocalDateTime sentAt;

    // 🔹 Constructor estático (mapper limpio)
    public static MessageResponse from(Message message) {
        MessageResponse dto = new MessageResponse();
        dto.id = message.getId();
        dto.conversationId = message.getConversationId();
        dto.senderId = message.getSenderId();
        dto.type = message.getType();
        dto.content = message.getContent();
        dto.sentAt = message.getSentAt();
        return dto;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getConversationId() {
        return conversationId;
    }

    public String getSenderId() {
        return senderId;
    }

    public MessageType getType() {
        return type;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }
}
