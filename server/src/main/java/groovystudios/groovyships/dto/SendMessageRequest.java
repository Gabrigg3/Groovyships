package groovystudios.groovyships.dto;

import groovystudios.groovyships.model.MessageType;

public class SendMessageRequest {

    private MessageType type;
    private String content;

    public MessageType getType() {
        return type;
    }

    public String getContent() {
        return content;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
