package groovystudios.groovyships.dto.v0;

public class NotificationEvent {

    private String type; // MESSAGE, MATCH
    private String title;
    private String body;

    public NotificationEvent(String type, String title, String body) {
        this.type = type;
        this.title = title;
        this.body = body;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getBody() {
        return body;
    }
}

