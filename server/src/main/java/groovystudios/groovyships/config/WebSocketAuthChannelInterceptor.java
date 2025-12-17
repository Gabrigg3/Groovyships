package groovystudios.groovyships.config;

import groovystudios.groovyships.model.User;
import groovystudios.groovyships.service.AuthenticationService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    private final AuthenticationService authService;

    public WebSocketAuthChannelInterceptor(AuthenticationService authService) {
        this.authService = authService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) return message;

        // 🔑 AUTENTICAR SOLO EN CONNECT
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new IllegalArgumentException("Missing Authorization header in WS CONNECT");
            }

            String token = authHeader.substring(7);

            User user = authService.validateAccessToken(token);

            // 🔥 PRINCIPAL REAL PARA SPRING
            accessor.setUser(() -> user.getId());

            // DEBUG ÚTIL
            System.out.println("🟢 WS CONNECT USER = " + user.getId());
        }

        return message;
    }
}
