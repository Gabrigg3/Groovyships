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

    // ----------------------------------------------------
    // 🔹 Si el usuario NO está en Mongo, creamos uno dummy
    // ----------------------------------------------------
    private User getOrCreateDummy(String id) {

        return userRepo.findById(id).orElseGet(() -> {
            User u = new User();
            u.setId(id);
            u.setNombre("Dummy " + id);
            u.setEdad(25);
            u.setEmail(id + "@dummy.com");
            return userRepo.save(u);   // se guarda para evitar más errores
        });
    }

    // ----------------------------------------------------
    public List<Match> getMatchesForUser(String userId) {
        User user = getOrCreateDummy(userId);
        return matchRepo.findByUsuarioOrTarget(user, user);
    }

    // ----------------------------------------------------
    public Match interact(String userId, String targetId, String action) {

        User user = userRepo.findById(userId).orElseThrow();
        User target = userRepo.findById(targetId).orElseThrow();

        // Ignorar matches recíprocos → solo importa lo que hace el usuario actual
        Match interaction = new Match(user, target, action);
        matchRepo.save(interaction);

        return interaction;
    }

    // ----------------------------------------------------
    public List<User> getSuggestions(String userId) {

        User user = getOrCreateDummy(userId);

        List<Match> interactions = matchRepo.findByUsuarioOrTarget(user, user);

        List<String> interactedUserIds = interactions.stream()
                .map(m -> m.getUsuario().getId().equals(userId)
                        ? m.getUsuario2().getId()
                        : m.getUsuario().getId()
                )
                .toList();

        return userRepo.findAll().stream()
                .filter(u -> !u.getId().equals(userId))
                .filter(u -> !interactedUserIds.contains(u.getId()))
                .toList();
    }
}