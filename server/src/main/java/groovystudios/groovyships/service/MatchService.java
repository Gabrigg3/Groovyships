package groovystudios.groovyships.service;

import groovystudios.groovyships.model.Conversation;
import groovystudios.groovyships.model.Match;
import groovystudios.groovyships.model.NotificationType;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.repository.ConversationRepository;
import groovystudios.groovyships.repository.MatchRepository;
import groovystudios.groovyships.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MatchService {

    private final MatchRepository matchRepo;
    private final UserRepository userRepo;
    private final ConversationRepository conversationRepo;
    private final NotificationService notificationService;

    // --------------------------------------------------
    // CONSTRUCTOR
    // --------------------------------------------------
    public MatchService(
            MatchRepository matchRepo,
            UserRepository userRepo, ConversationRepository conversationRepo,
            NotificationService notificationService
    ) {
        this.matchRepo = matchRepo;
        this.userRepo = userRepo;
        this.conversationRepo = conversationRepo;
        this.notificationService = notificationService;
    }

    // --------------------------------------------------
    // OBTENER MATCHES DE UN USUARIO
    // --------------------------------------------------
    public List<Match> getMatchesForUser(String userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return matchRepo.findByUsuarioOrTarget(user, user);
    }

    // --------------------------------------------------
    // LIKE / DISLIKE
    // --------------------------------------------------
    public Match interact(String userId, String targetId, String action) {

        User user = userRepo.findById(userId).orElseThrow();
        User target = userRepo.findById(targetId).orElseThrow();

        // ¿Existe interacción inversa?
        Optional<Match> reverse = matchRepo.findByUsuarioAndTarget(target, user);

        // Guardar interacción actual
        Match interaction = new Match(user, target, action);
        matchRepo.save(interaction);

        // --------------------------------------------------
        // LIKE MUTUO → MATCH REAL
        // --------------------------------------------------
        if ("LIKE".equals(action)
                && reverse.isPresent()
                && "LIKE".equals(reverse.get().getStatus1())) {

            // CREAR (O RECUPERAR) CONVERSACIÓN
            getOrCreateConversation(user.getId(), target.getId());

            // 🔔 Notificación para TARGET
            notificationService.createNotification(
                    target.getId(),
                    NotificationType.MATCH,
                    Map.of("profile", buildUserLight(user))
            );

            // 🔔 Notificación para USER
            notificationService.createNotification(
                    user.getId(),
                    NotificationType.MATCH,
                    Map.of("profile", buildUserLight(target))
            );
        }


        return interaction;
    }

    // --------------------------------------------------
    // SUGERENCIAS DE USUARIOS
    // --------------------------------------------------
    public List<User> getSuggestions(String userId) {

        User user = userRepo.findById(userId).orElseThrow();

        List<Match> interactions = matchRepo.findByUsuarioOrTarget(user, user);

        List<String> interactedUserIds = interactions.stream()
                .map(match -> {
                    if (match.getUsuario().getId().equals(userId)) {
                        return match.getUsuario2().getId();
                    }
                    return null;
                })
                .filter(id -> id != null)
                .toList();

        return userRepo.findAll().stream()
                .filter(u -> !u.getId().equals(userId))
                .filter(u -> !interactedUserIds.contains(u.getId()))
                .toList();
    }

    // --------------------------------------------------
    // TODOS LOS MATCHES (ADMIN / DEBUG)
    // --------------------------------------------------
    public List<Match> getAllMatches() {
        return matchRepo.findAll();
    }

    // --------------------------------------------------
    // CONSTRUCCIÓN DE UserLight PARA NOTIFICACIONES
    // --------------------------------------------------
    private Map<String, Object> buildUserLight(User u) {
        return Map.of(
                "id", u.getId(),
                "nombre", u.getNombre(),
                "edad", u.getEdad(),
                "imagenes", u.getImagenes(),
                "lookingFor", u.getLookingFor()
        );
    }


    // --------------------------------------------------
    // CREACIÓN DE CONVERSACIONES AL HACER MATCH
    // --------------------------------------------------
    public Conversation getOrCreateConversation(String userAId, String userBId) {

        return conversationRepo
                .findByUserAIdAndUserBId(userAId, userBId)
                .or(() -> conversationRepo.findByUserAIdAndUserBId(userBId, userAId))
                .orElseGet(() -> {
                    Conversation c = new Conversation(userAId, userBId);
                    return conversationRepo.save(c);
                });
    }
}