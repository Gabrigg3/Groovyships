package groovystudios.groovyships.service;

import groovystudios.groovyships.dto.MessageEvent;
import groovystudios.groovyships.dto.NotificationEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // 💬 Mensaje en tiempo real
    public void sendMessageToConversation(String conversationId, MessageEvent event) {
        messagingTemplate.convertAndSend(
                "/topic/conversations/" + conversationId,
                event
        );
    }

    // 🔔 Notificación a usuario concreto
    public void sendNotificationToUser(String userId, NotificationEvent event) {
        messagingTemplate.convertAndSend(
                "/queue/notifications/" + userId,
                event
        );
    }
}
