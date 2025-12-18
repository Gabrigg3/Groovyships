package groovystudios.groovyships.service;

import groovystudios.groovyships.dto.v0.MessageEvent;
import groovystudios.groovyships.dto.v0.NotificationEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    //Mensajes de conversación (broadcast)
    public void sendMessageToConversation(String conversationId, MessageEvent event) {
        messagingTemplate.convertAndSend(
                "/topic/conversations/" + conversationId,
                event
        );
    }

    //Notificación privada a usuario
    public void sendNotificationToUser(String userId, NotificationEvent event) {

        System.out.println("+ WebSocket sendNotificationToUser");
        System.out.println("   destination = /queue/notifications/" + userId);
        System.out.println("   event = " + event);


        messagingTemplate.convertAndSendToUser(
                userId,                       // principal name
                "/queue/notifications",       // destino RELATIVO
                event
        );
    }

}

