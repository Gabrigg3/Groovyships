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
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MatchRepository matchRepository;

    public Message sendMessage(String matchId, String senderId, String content) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match no encontrado"));

        Message message = new Message();
        message.setMatch(match);
        message.setSender(match.getUsuario().getId().equals(senderId) ? match.getUsuario() : match.getUsuario2());
        message.setContent(content);

        return messageRepository.save(message);
    }

    public List<Message> getMessages(String matchId) {
        return messageRepository.findByMatchIdOrderBySentAtAsc(matchId);
    }
}

