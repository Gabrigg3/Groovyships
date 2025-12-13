package groovystudios.groovyships.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    private String conversationId;
    private String senderId;

    private MessageType type;

    /**
     * - TEXT  -> texto
     * - IMAGE -> URL imagen
     * - AUDIO -> URL audio
     * - VIDEO -> URL vídeo
     */
    private String content;

    private LocalDateTime sentAt = LocalDateTime.now();

    public Message() {}

    public Message(
            String conversationId,
            String senderId,
            MessageType type,
            String content
    ) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.type = type;
        this.content = content;
    }

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

    public void setId(String id) {
        this.id = id;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
