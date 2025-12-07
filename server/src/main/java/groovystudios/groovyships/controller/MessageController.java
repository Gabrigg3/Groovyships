package groovystudios.groovyships.controller;

import groovystudios.groovyships.model.Message;
import groovystudios.groovyships.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")

//TODO: Revisar si hay que devolver User o UserLight

public class MessageController {

    @Autowired
    private MessageService messageService;

    //Endpoint para enviar un mensaje en un match específico
    @PostMapping("/{matchId}/send")
    public ResponseEntity<Message> sendMessage(
            @PathVariable String matchId, //ID del match al que pertenece el mensaje
            @RequestParam String senderId, //ID del usuario que envía el mensaje
            @RequestBody String content) { //Contenido del mensaje

        Message message = messageService.sendMessage(matchId, senderId, content); //Llama al servicio de mensajes para enviar el mensaje
        return ResponseEntity.ok(message); //Devuelve el mensaje enviado en la respuesta.
    }

    //Endpoint para obtener todos los mensajes de un match específico
    @GetMapping("/{matchId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String matchId) {
        return ResponseEntity.ok(messageService.getMessages(matchId)); //Llama al servicio de mensajes para obtener los mensajes del match y los devuelve en la respuesta.
    }

}
