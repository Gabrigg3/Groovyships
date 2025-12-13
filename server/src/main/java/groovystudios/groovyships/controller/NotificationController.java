package groovystudios.groovyships.controller;

import groovystudios.groovyships.dto.NotificationResponse;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // --------------------------------------------------
    // TODAS LAS NOTIFICACIONES DEL USUARIO
    // --------------------------------------------------
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAll(
            Authentication authentication
    ) {
        String userId = authentication.getName();

        return ResponseEntity.ok(
                notificationService.getNotificationsForUser(userId)
                        .stream()
                        .map(NotificationResponse::new)
                        .toList()
        );
    }

    // --------------------------------------------------
    // SOLO NOTIFICACIONES NO LEÍDAS
    // --------------------------------------------------
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnread(
            Authentication authentication
    ) {
        String userId = authentication.getName();

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(userId)
                        .stream()
                        .map(NotificationResponse::new)
                        .toList()
        );
    }

    // --------------------------------------------------
    // MARCAR UNA NOTIFICACIÓN COMO LEÍDA
    // --------------------------------------------------
    @PostMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable String notificationId,
            Authentication authentication
    ) {


        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

    // --------------------------------------------------
    // MARCAR TODAS COMO LEÍDAS
    // --------------------------------------------------
    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            Authentication authentication
    ) {
        String userId = authentication.getName();

        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
}
