package groovystudios.groovyships.service;

import groovystudios.groovyships.model.Notification;
import groovystudios.groovyships.model.NotificationType;
import groovystudios.groovyships.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(
            NotificationRepository notificationRepo,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.notificationRepo = notificationRepo;
        this.messagingTemplate = messagingTemplate;
    }

    // --------------------------------------------------
    // CREAR NOTIFICACIÓN + EMITIR POR WEBSOCKET
    // --------------------------------------------------
    public Notification createNotification(
            String userId,
            NotificationType type,
            Map<String, Object> payload
    ) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setPayload(payload);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepo.save(notification);

        // 🔔 Enviar notificación en tiempo real
        messagingTemplate.convertAndSend(
                "/topic/notifications/" + userId,
                saved
        );

        return saved;
    }

    // --------------------------------------------------
    // TODAS LAS NOTIFICACIONES DEL USUARIO
    // --------------------------------------------------
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // --------------------------------------------------
    // SOLO NO LEÍDAS
    // --------------------------------------------------
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepo.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    // --------------------------------------------------
    // MARCAR UNA COMO LEÍDA
    // --------------------------------------------------
    public void markAsRead(String notificationId) {
        notificationRepo.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepo.save(notification);
        });
    }

    // --------------------------------------------------
    // MARCAR TODAS COMO LEÍDAS
    // --------------------------------------------------
    public void markAllAsRead(String userId) {
        List<Notification> notifications =
                notificationRepo.findByUserIdAndReadFalse(userId);

        notifications.forEach(n -> n.setRead(true));
        notificationRepo.saveAll(notifications);
    }
}
