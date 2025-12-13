package groovystudios.groovyships.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "conversations")
public class Conversation {

    @Id
    private String id;

    private String userAId;
    private String userBId;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Conversation(String userAId, String userBId) {
        this.userAId = userAId;
        this.userBId = userBId;
    }

    public Conversation() {}


    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getUserAId() {
        return userAId;
    }
    public void setUserAId(String userAId) {
        this.userAId = userAId;
    }

    public String getUserBId() {
        return userBId;
    }
    public void setUserBId(String userBId) {
        this.userBId = userBId;
    }

    public boolean hasUser(String userId) {
        return userAId.equals(userId) || userBId.equals(userId);
    }

}
