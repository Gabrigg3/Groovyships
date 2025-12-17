package groovystudios.groovyships.controller.v0;

import groovystudios.groovyships.dto.v0.ConversationResponse;
import groovystudios.groovyships.service.ConversationService;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/api/v0/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping
    public List<ConversationResponse> getMyConversations(
            Authentication authentication
    ) {
        String userId = authentication.getName();
        return conversationService.getUserConversations(userId);
    }
}
