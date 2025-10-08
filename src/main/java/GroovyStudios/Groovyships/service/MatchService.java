package GroovyStudios.Groovyships.service;

import GroovyStudios.Groovyships.model.Match;
import GroovyStudios.Groovyships.model.User;
import GroovyStudios.Groovyships.repository.MatchRepository;
import GroovyStudios.Groovyships.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MatchService {

    private final MatchRepository matchRepo;
    private final UserRepository userRepo;

    public MatchService(MatchRepository matchRepo, UserRepository userRepo) {
        this.matchRepo = matchRepo;
        this.userRepo = userRepo;
    }

    public List<Match> getMatchesForUser(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return matchRepo.findByUser1OrUser2(user, user);
    }

    public Match likeUser(Long userId, Long targetId) {
        User user = userRepo.findById(userId).orElseThrow();
        User target = userRepo.findById(targetId).orElseThrow();

        // Ver si ya existe una interacción inversa (target ya le dio like)
        Optional<Match> existing = matchRepo.findByUser1AndUser2(target, user);

        if (existing.isPresent()) {
            // Si ya existía, se convierte en match
            Match match = existing.get();
            match.setEsMutuo(true);
            return matchRepo.save(match);
        } else {
            // Si no existía, se crea un nuevo registro
            Match newLike = new Match(user, target);
            return matchRepo.save(newLike);
        }
    }
}