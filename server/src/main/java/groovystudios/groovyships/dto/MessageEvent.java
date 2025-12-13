package groovystudios.groovyships.dto;

public class MessageEvent {

    private String conversationId;
    private MessageResponse message;

    public MessageEvent(String conversationId, MessageResponse message) {
        this.conversationId = conversationId;
        this.message = message;
    }

    public String getConversationId() {
        return conversationId;
    }

    public MessageResponse getMessage() {
        return message;
    }
}

