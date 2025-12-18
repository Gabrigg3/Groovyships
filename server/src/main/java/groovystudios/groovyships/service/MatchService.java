package groovystudios.groovyships.service;

import groovystudios.groovyships.model.Conversation;
import groovystudios.groovyships.model.Match;
import groovystudios.groovyships.model.NotificationType;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.repository.ConversationRepository;
import groovystudios.groovyships.repository.MatchRepository;
import groovystudios.groovyships.repository.MessageRepository;
import groovystudios.groovyships.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MatchService {

    private final MessageRepository messageRepo;
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
            NotificationService notificationService,
            MessageRepository messageRepo
    ) {
        this.matchRepo = matchRepo;
        this.userRepo = userRepo;
        this.conversationRepo = conversationRepo;
        this.notificationService = notificationService;
        this.messageRepo = messageRepo;
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

        System.out.println("==================================================");
        System.out.println("+ interact()");
        System.out.println("   userId    = " + userId);
        System.out.println("   targetId  = " + targetId);
        System.out.println("   action    = " + action);
        System.out.println("==================================================");

        System.out.println("+ notificationService class = "
                + notificationService.getClass().getName());


        User user = userRepo.findById(userId).orElseThrow();
        User target = userRepo.findById(targetId).orElseThrow();

        System.out.println("+ Usuarios cargados");
        System.out.println("   user.id   = " + user.getId());
        System.out.println("   target.id = " + target.getId());


        //INTERACCIÓN USER → TARGET
        Optional<Match> existingOpt =
                matchRepo.findByUsuarioAndTarget(user, target);

        System.out.println("--------------------------------------------------");
        System.out.println("+ existing interaction user → target");
        System.out.println("   exists = " + existingOpt.isPresent());

        Match interaction;

        if (existingOpt.isPresent()) {
            interaction = existingOpt.get();
            System.out.println("   existing.status1 BEFORE = " + interaction.getStatus1());
        } else {
            interaction = new Match(user, target, action);
            System.out.println("   creating new Match(user → target)");
        }

        interaction.setStatus1(action);
        matchRepo.save(interaction);

        System.out.println("   interaction.status1 AFTER = " + interaction.getStatus1());



        //INTERACCIÓN INVERSA TARGET → USER
        Optional<Match> reverseOpt =
                matchRepo.findByUsuarioAndTarget(target, user);

        System.out.println("--------------------------------------------------");
        System.out.println("+ reverse interaction target → user");
        System.out.println("   exists = " + reverseOpt.isPresent());

        if (reverseOpt.isPresent()) {
            System.out.println("   reverse.status1 = " + reverseOpt.get().getStatus1());
        }


        //CÁLCULO DE MATCH MUTUO
        boolean actionIsLike = "LIKE".equals(action);
        boolean reverseExists = reverseOpt.isPresent();
        boolean reverseIsLike = reverseExists &&
                "LIKE".equals(reverseOpt.get().getStatus1());

        System.out.println("--------------------------------------------------");
        System.out.println("+ mutualLike evaluation");
        System.out.println("   actionIsLike   = " + actionIsLike);
        System.out.println("   reverseExists  = " + reverseExists);
        System.out.println("   reverseIsLike  = " + reverseIsLike);

        boolean mutualLike = actionIsLike && reverseExists && reverseIsLike;

        System.out.println("   + mutualLike = " + mutualLike);

        if (!mutualLike) {
            System.out.println("+ NO MATCH MUTUO → return interaction");
            return interaction;
        }


        //COMPROBACIÓN DE CONVERSACIÓN
        boolean conversationExists =
                conversationRepo
                        .findByUserAIdAndUserBId(user.getId(), target.getId())
                        .or(() -> conversationRepo.findByUserAIdAndUserBId(
                                target.getId(), user.getId()
                        ))
                        .isPresent();

        System.out.println("--------------------------------------------------");
        System.out.println("+ conversationExists = " + conversationExists);

        if (conversationExists) {
            System.out.println("+️ Match ya procesado → return interaction");
            return interaction;
        }


        //MATCH REAL
        System.out.println("+ MATCH MUTUO REAL +");

        getOrCreateConversation(user.getId(), target.getId());
        System.out.println("+ Conversación creada");

        System.out.println("+ creando notificación para TARGET");
        notificationService.createNotification(
                target.getId(),
                NotificationType.MATCH,
                Map.of("profile", buildUserLight(user))
        );

        System.out.println("+ creando notificación para USER");
        notificationService.createNotification(
                user.getId(),
                NotificationType.MATCH,
                Map.of("profile", buildUserLight(target))
        );

        System.out.println("==================================================");
        System.out.println("+ interact() FIN");
        System.out.println("==================================================");

        return interaction;
    }


    //SUGERENCIAS DE USUARIOS
    private boolean isAgeCompatible(User candidate, List<Integer> ageRange) {
        if (candidate.getEdad() == null || ageRange == null || ageRange.size() != 2) {
            return true; // no filtrar si faltan datos
        }
        return candidate.getEdad() >= ageRange.get(0)
                && candidate.getEdad() <= ageRange.get(1);
    }

    private boolean isLookingForCompatible(User current, User candidate) {
        if (current.getLookingFor() == null || candidate.getLookingFor() == null) {
            return true;
        }

        return current.getLookingFor().stream()
                .anyMatch(candidate.getLookingFor()::contains);
    }

    private boolean isGenderCompatible(User current, User candidate) {

        String candidateGender = candidate.getGeneroUsuario();

        //Si no sabemos el género del candidato, no filtramos
        if (candidateGender == null) return true;

        //Si el usuario no tiene preferencias, no filtramos
        if (current.getLookingFor() == null || current.getLookingFor().isEmpty()) {
            return true;
        }

        boolean compatible = false;

        //ROMANCE
        if (current.getLookingFor().contains("romance")
                && current.getGenerosRomance() != null
                && !current.getGenerosRomance().isEmpty()) {

            if (current.getGenerosRomance().contains(candidateGender)) {
                compatible = true;
            }
        }

        //AMISTAD
        if (current.getLookingFor().contains("amistad")
                && current.getGenerosAmistad() != null
                && !current.getGenerosAmistad().isEmpty()) {

            if (current.getGenerosAmistad().contains(candidateGender)) {
                compatible = true;
            }
        }

        return compatible;
    }

    private int countCommonInterests(User a, User b) {
        if (a.getIntereses() == null || b.getIntereses() == null) {
            return 0;
        }

        return (int) a.getIntereses().stream()
                .filter(b.getIntereses()::contains)
                .count();
    }


    public List<User> getSuggestions(String userId) {

        User currentUser = userRepo.findById(userId).orElseThrow();

        //Interacciones previas
        List<Match> interactions = matchRepo.findByUsuarioOrTarget(currentUser, currentUser);

        List<String> excludedUserIds = interactions.stream()
                .map(match -> {
                    if (match.getUsuario().getId().equals(userId)) {
                        return match.getUsuario2().getId();
                    }
                    return null;
                })
                .filter(id -> id != null)
                .toList();

        //Preferencias del usuario actual
        List<Integer> ageRange = currentUser.getRangoEdad(); // [min, max]
        List<String> lookingFor = currentUser.getLookingFor();
        List<String> generosRomance = currentUser.getGenerosRomance();
        List<String> generosAmistad = currentUser.getGenerosAmistad();

        return userRepo.findAll().stream()

                .filter(u -> !u.getId().equals(userId))

                .filter(u -> !excludedUserIds.contains(u.getId()))

                .filter(u -> isAgeCompatible(u, ageRange))

                .filter(u -> isLookingForCompatible(currentUser, u))

                //género compatible según modo
                .filter(u -> isGenderCompatible(currentUser, u))
                .sorted((u1, u2) -> {
                    int common1 = countCommonInterests(currentUser, u1);
                    int common2 = countCommonInterests(currentUser, u2);
                    return Integer.compare(common2, common1); // DESC
                })
                .toList();
    }


    //TODOS LOS MATCHES (ADMIN / DEBUG)
    public List<Match> getAllMatches() {
        return matchRepo.findAll();
    }


    //CONSTRUCCIÓN DE UserLight PARA NOTIFICACIONES
    private Map<String, Object> buildUserLight(User u) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", u.getId());
        map.put("nombre", u.getNombre());
        map.put("edad", u.getEdad());
        map.put("gender", u.getGeneroUsuario());
        map.put("imagenes", u.getImagenes() != null ? u.getImagenes() : List.of());
        map.put("lookingFor", u.getLookingFor() != null ? u.getLookingFor() : List.of());
        return map;
    }



    //CREACIÓN DE CONVERSACIONES AL HACER MATCH
    public Conversation getOrCreateConversation(String userAId, String userBId) {

        return conversationRepo
                .findByUserAIdAndUserBId(userAId, userBId)
                .or(() -> conversationRepo.findByUserAIdAndUserBId(userBId, userAId))
                .orElseGet(() -> {
                    Conversation c = new Conversation(userAId, userBId);
                    return conversationRepo.save(c);
                });
    }



    public void breakMatch(String userId, String targetId) {

        User user = userRepo.findById(userId).orElseThrow();
        User target = userRepo.findById(targetId).orElseThrow();

        // 1. Cambiar LIKE -> DISLIKE (user → target)
        matchRepo.findByUsuarioAndTarget(user, target)
                .ifPresent(match -> {
                    match.setStatus1("DISLIKE");
                    matchRepo.save(match);
                });

        // 2. Eliminar interacción inversa (target → user)
        matchRepo.findByUsuarioAndTarget(target, user)
                .ifPresent(matchRepo::delete);

        // 3. Buscar conversación
        conversationRepo
                .findByUserAIdAndUserBId(userId, targetId)
                .or(() -> conversationRepo.findByUserAIdAndUserBId(targetId, userId))
                .ifPresent(conversation -> {

                    // 4. Borrar mensajes
                    messageRepo.deleteByConversationId(conversation.getId());

                    // 5. Borrar conversación
                    conversationRepo.delete(conversation);
                });
    }

}