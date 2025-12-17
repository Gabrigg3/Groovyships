package groovystudios.groovyships.dto.v0;

import java.time.LocalDateTime;

public class ConversationResponse {

    private String conversationId;

    private String otherUserId;
    private String otherUserName;
    private String otherUserImage;

    private String lastMessage;
    private LocalDateTime lastMessageAt;

    public ConversationResponse(
            String conversationId,
            String otherUserId,
            String otherUserName,
            String otherUserImage,
            String lastMessage,
            LocalDateTime lastMessageAt
    ) {
        this.conversationId = conversationId;
        this.otherUserId = otherUserId;
        this.otherUserName = otherUserName;
        this.otherUserImage = otherUserImage;
        this.lastMessage = lastMessage;
        this.lastMessageAt = lastMessageAt;
    }

    public String getConversationId() {
        return conversationId;
    }

    public String getOtherUserId() {
        return otherUserId;
    }

    public String getOtherUserName() {
        return otherUserName;
    }

    public String getOtherUserImage() {
        return otherUserImage;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }
}
