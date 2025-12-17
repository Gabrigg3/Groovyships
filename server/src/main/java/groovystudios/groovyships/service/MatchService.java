package groovystudios.groovyships.service;

import groovystudios.groovyships.model.Conversation;
import groovystudios.groovyships.model.Match;
import groovystudios.groovyships.model.NotificationType;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.repository.ConversationRepository;
import groovystudios.groovyships.repository.MatchRepository;
import groovystudios.groovyships.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
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

        System.out.println("==================================================");
        System.out.println("👉 interact()");
        System.out.println("   userId    = " + userId);
        System.out.println("   targetId  = " + targetId);
        System.out.println("   action    = " + action);
        System.out.println("==================================================");

        System.out.println("🧩 notificationService class = "
                + notificationService.getClass().getName());


        User user = userRepo.findById(userId).orElseThrow();
        User target = userRepo.findById(targetId).orElseThrow();

        System.out.println("✔ Usuarios cargados");
        System.out.println("   user.id   = " + user.getId());
        System.out.println("   target.id = " + target.getId());

        // --------------------------------------------------
        // 1️⃣ INTERACCIÓN USER → TARGET
        // --------------------------------------------------
        Optional<Match> existingOpt =
                matchRepo.findByUsuarioAndTarget(user, target);

        System.out.println("--------------------------------------------------");
        System.out.println("🔍 existing interaction user → target");
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



        // --------------------------------------------------
        // 2️⃣ INTERACCIÓN INVERSA TARGET → USER
        // --------------------------------------------------
        Optional<Match> reverseOpt =
                matchRepo.findByUsuarioAndTarget(target, user);

        System.out.println("--------------------------------------------------");
        System.out.println("🔍 reverse interaction target → user");
        System.out.println("   exists = " + reverseOpt.isPresent());

        if (reverseOpt.isPresent()) {
            System.out.println("   reverse.status1 = " + reverseOpt.get().getStatus1());
        }

        // --------------------------------------------------
        // 3️⃣ CÁLCULO DE MATCH MUTUO
        // --------------------------------------------------
        boolean actionIsLike = "LIKE".equals(action);
        boolean reverseExists = reverseOpt.isPresent();
        boolean reverseIsLike = reverseExists &&
                "LIKE".equals(reverseOpt.get().getStatus1());

        System.out.println("--------------------------------------------------");
        System.out.println("🧠 mutualLike evaluation");
        System.out.println("   actionIsLike   = " + actionIsLike);
        System.out.println("   reverseExists  = " + reverseExists);
        System.out.println("   reverseIsLike  = " + reverseIsLike);

        boolean mutualLike = actionIsLike && reverseExists && reverseIsLike;

        System.out.println("   👉 mutualLike = " + mutualLike);

        if (!mutualLike) {
            System.out.println("❌ NO MATCH MUTUO → return interaction");
            return interaction;
        }

        // --------------------------------------------------
        // 4️⃣ COMPROBACIÓN DE CONVERSACIÓN
        // --------------------------------------------------
        boolean conversationExists =
                conversationRepo
                        .findByUserAIdAndUserBId(user.getId(), target.getId())
                        .or(() -> conversationRepo.findByUserAIdAndUserBId(
                                target.getId(), user.getId()
                        ))
                        .isPresent();

        System.out.println("--------------------------------------------------");
        System.out.println("💬 conversationExists = " + conversationExists);

        if (conversationExists) {
            System.out.println("⚠️ Match ya procesado → return interaction");
            return interaction;
        }

        // --------------------------------------------------
        // 5️⃣ MATCH REAL
        // --------------------------------------------------
        System.out.println("🔥🔥🔥 MATCH MUTUO REAL 🔥🔥🔥");

        getOrCreateConversation(user.getId(), target.getId());
        System.out.println("✔ Conversación creada");

        System.out.println("🔔 creando notificación para TARGET");
        notificationService.createNotification(
                target.getId(),
                NotificationType.MATCH,
                Map.of("profile", buildUserLight(user))
        );

        System.out.println("🔔 creando notificación para USER");
        notificationService.createNotification(
                user.getId(),
                NotificationType.MATCH,
                Map.of("profile", buildUserLight(target))
        );

        System.out.println("==================================================");
        System.out.println("✔ interact() FIN");
        System.out.println("==================================================");

        return interaction;
    }




    // --------------------------------------------------
    // SUGERENCIAS DE USUARIOS
    // --------------------------------------------------

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
        if (candidateGender == null) return true;

        if (current.getLookingFor() == null) return true;

        // ROMANCE
        if (current.getLookingFor().contains("romance")) {
            if (current.getGenerosRomance() != null &&
                    !current.getGenerosRomance().isEmpty()) {
                return current.getGenerosRomance().contains(candidateGender);
            }
        }

        // AMISTAD
        if (current.getLookingFor().contains("amistad")) {
            if (current.getGenerosAmistad() != null &&
                    !current.getGenerosAmistad().isEmpty()) {
                return current.getGenerosAmistad().contains(candidateGender);
            }
        }

        return true;
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

        // 1️⃣ Interacciones previas
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

                //no, yo
                .filter(u -> !u.getId().equals(userId))

                //no, ya interactuados
                .filter(u -> !excludedUserIds.contains(u.getId()))

                //edad compatible
                .filter(u -> isAgeCompatible(u, ageRange))

                // lookingFor compatible
                .filter(u -> isLookingForCompatible(currentUser, u))

                // género compatible según modo
                .filter(u -> isGenderCompatible(currentUser, u))
                .sorted((u1, u2) -> {
                    int common1 = countCommonInterests(currentUser, u1);
                    int common2 = countCommonInterests(currentUser, u2);
                    return Integer.compare(common2, common1); // DESC
                })
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
        Map<String, Object> map = new HashMap<>();
        map.put("id", u.getId());
        map.put("nombre", u.getNombre());
        map.put("edad", u.getEdad());
        map.put("gender", u.getGeneroUsuario());
        map.put("imagenes", u.getImagenes() != null ? u.getImagenes() : List.of());
        map.put("lookingFor", u.getLookingFor() != null ? u.getLookingFor() : List.of());
        return map;
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