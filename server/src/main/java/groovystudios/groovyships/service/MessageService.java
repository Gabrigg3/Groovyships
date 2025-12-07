package groovystudios.groovyships.service;

import groovystudios.groovyships.model.Match;
import groovystudios.groovyships.model.Message;
import groovystudios.groovyships.repository.MatchRepository;
import groovystudios.groovyships.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    //Repositorio de mensajes -> se usa para guardar y recuperar mensajes desde MongoDB
    @Autowired
    private MessageRepository messageRepository;

    //Repositorio de matches → se usa para comprobar qué usuarios pertenecen al match
    @Autowired
    private MatchRepository matchRepository;

    //Enviar un mensaje a un usuario con el que se tiene un match
    public Message sendMessage(String matchId, String senderId, String content) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match no encontrado")); //Busca el match por su ID, si no lo encuentra lanza una excepción

        Message message = new Message(); //Crea un nuevo mensaje
        message.setMatch(match); //Asocia el mensaje al match correspondiente
        message.setSender(match.getUsuario().getId().equals(senderId) ? match.getUsuario() : match.getUsuario2()); //Establece el remitente del mensaje comprobando si es el usuario 1 o el usuario 2 del match
        message.setContent(content); //Establece el contenido del mensaje

        return messageRepository.save(message); //Guarda el mensaje en la base de datos y lo devuelve
    }

    //Obtener todos los mensajes de un match específico
    public List<Message> getMessages(String matchId) {
        return messageRepository.findByMatchIdOrderBySentAtAsc(matchId); //Busca y devuelve todos los mensajes asociados al match ordenados por fecha de envío
    }
}

