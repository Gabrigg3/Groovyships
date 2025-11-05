package GroovyStudios.Groovyships.controller;

import GroovyStudios.Groovyships.model.Message;
import GroovyStudios.Groovyships.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @PostMapping("/{matchId}/send")
    public ResponseEntity<Message> sendMessage(
            @PathVariable Long matchId,
            @RequestParam Long senderId,
            @RequestBody String content) {

        Message message = messageService.sendMessage(matchId, senderId, content);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/{matchId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long matchId) {
        return ResponseEntity.ok(messageService.getMessages(matchId));
    }
}
