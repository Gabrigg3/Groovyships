package groovystudios.groovyships.service;

import GroovyStudios.Groovyships.model.Match;
import GroovyStudios.Groovyships.model.Message;
import GroovyStudios.Groovyships.repository.MatchRepository;
import GroovyStudios.Groovyships.repository.MessageRepository;
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

