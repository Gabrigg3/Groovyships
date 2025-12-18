package groovystudios.groovyships.dto.v0;

import groovystudios.groovyships.model.Notification;

import java.time.LocalDateTime;
import java.util.Map;

public class NotificationResponse {

    private String id;
    private String type;
    private Map<String, Object> payload;
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationResponse(Notification n) {
        this.id = n.getId();
        this.type = n.getType().name();
        this.payload = n.getPayload();
        this.read = n.isRead();
        this.createdAt = n.getCreatedAt();
    }

}

