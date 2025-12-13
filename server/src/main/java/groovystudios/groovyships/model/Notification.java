package groovystudios.groovyships.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    // Usuario que recibe la notificación
    private String userId;

    // Tipo de notificación: MATCH, MESSAGE, LIKE, etc.
    private NotificationType type;

    // Datos extra según el tipo (ej: userId del match, messageId, etc.)
    private Map<String, Object> payload;

    // Leída o no
    private boolean read;

    // Fecha de creación
    private LocalDateTime createdAt;

    // Constructor vacío (Mongo)
    public Notification() {
    }

    // Constructor principal
    public Notification(
            String userId,
            NotificationType type,
            Map<String, Object> payload
    ) {
        this.userId = userId;
        this.type = type;
        this.payload = payload;
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }

    // -------------------
    // Getters y setters
    // -------------------

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public NotificationType getType() {
        return type;
    }
    public void setType(NotificationType type) {
        this.type = type;
    }

    public Map<String, Object> getPayload() {
        return payload;
    }
    public void setPayload(Map<String, Object> payload) {
        this.payload = payload;
    }

    public boolean isRead() {
        return read;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public void setCreatedAt(LocalDateTime now) {
        this.createdAt = now;
    }
}