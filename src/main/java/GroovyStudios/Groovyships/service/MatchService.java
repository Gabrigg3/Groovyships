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

    public List<Match> getMatchesForUser(String userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return matchRepo.findByUser1OrUser2(user, user);
    }

    public Match interact(String userId, String targetId, String action) {
        User user = userRepo.findById(userId).orElseThrow();
        User target = userRepo.findById(targetId).orElseThrow();

        Optional<Match> existing = matchRepo.findByUser1AndUser2(target, user);

        Match newInteraction = null;
        if (action.equals("LIKE")) {
            newInteraction= new Match(user, target, "LIKE");
        } else if (action.equals("DISLIKE")) {
            newInteraction= new Match(user, target, "DISLIKE");
        }
        matchRepo.save(newInteraction);
        return newInteraction;

    }

    public List<User> getSuggestions(String userId) {
        // Obtener el usuario actual
        User user = userRepo.findById(userId).orElseThrow();
        // Obtener todas las interacciones del usuario
        List<Match> interactions = matchRepo.findByUser1OrUser2(user, user);

        // Obtener los IDs de los usuarios con los que ya ha interactuado
        List<String> interactedUserIds = interactions.stream().map(match -> {
            if (match.getUsuario().getId().equals(userId)) {
                return match.getUsuario2().getId();
            } else {
                return match.getUsuario().getId();
            }
        }).toList();

        //Obtener los usuarios cuya edad está dentro del rango, comparte intereses y buscan lo mismo.
        List<Long> sharedUsers = userRepo.findUsersToInteract(userId);



        // Filtrar los usuarios que no son el usuario actual y con los que no ha interactuado
        return userRepo.findAll().stream()
                .filter(u -> !u.getId().equals(userId) && !interactedUserIds.contains(u.getId()))
                .toList();
    }
}