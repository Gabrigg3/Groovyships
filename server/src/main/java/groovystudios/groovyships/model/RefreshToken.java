package groovystudios.groovyships.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "refresh_tokens")
public class RefreshToken {

    @Id
    private String id; //ID único generado por MongoDB

    private String token; //Cadena opaca
    private String userId; //ID del usuario asociado al token
    private Instant expiryDate; //Fecha de expiración del token

    //Constructor vacío necesario para MongoDB
    public RefreshToken() {}

    //Constructor completo
    public RefreshToken(String token, String userId, Instant expiryDate) {
        this.token = token;
        this.userId = userId;
        this.expiryDate = expiryDate;
    }

    //Getters y Setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public Instant getExpiryDate() {
        return expiryDate;
    }
    public void setExpiryDate(Instant expiryDate) {
        this.expiryDate = expiryDate;
    }
}
