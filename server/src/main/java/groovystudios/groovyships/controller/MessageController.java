package groovystudios.groovyships.controller;

import groovystudios.groovyships.dto.MessageResponse;
import groovystudios.groovyships.dto.SendMessageRequest;
import groovystudios.groovyships.model.Message;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations/{conversationId}/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    // ---------------------------------------
    // ENVIAR MENSAJE
    // ---------------------------------------
    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable String conversationId,
            @RequestBody SendMessageRequest request,
            Authentication authentication
    ) {
        String userId = authentication.getName();

        Message message = messageService.sendMessage(
                conversationId,
                userId,
                request.getType(),
                request.getContent()
        );

        return ResponseEntity.ok(MessageResponse.from(message));
    }


    // ---------------------------------------
    // OBTENER MENSAJES
    // ---------------------------------------
    @GetMapping
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable String conversationId,
            Authentication authentication
    ) {
        String userId = authentication.getName();

        return ResponseEntity.ok(
                messageService.getMessages(conversationId, userId)
                        .stream()
                        .map(MessageResponse::from)
                        .toList()
        );
    }
}
