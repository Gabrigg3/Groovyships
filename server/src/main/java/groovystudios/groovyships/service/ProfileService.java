package groovystudios.groovyships.service;

import groovystudios.groovyships.dto.v0.ProfileResponse;
import groovystudios.groovyships.dto.v0.ProfileUpdateRequest;
import groovystudios.groovyships.model.Conversation;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.repository.ConversationRepository;
import groovystudios.groovyships.repository.InteresRepository;
import groovystudios.groovyships.repository.MessageRepository;
import groovystudios.groovyships.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final InteresRepository interesRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    private ProfileResponse mapToResponse(User user) {
        List<Integer> rango = user.getRangoEdad();

        return new ProfileResponse(
                user.getId(),
                user.getNombre(),
                user.getEdad(),
                user.getGeneroUsuario(),
                user.getOcupacion(),
                user.getUbicacion(),
                user.getBiografia(),
                user.getLookingFor(),
                user.getGenerosRomance(),
                user.getGenerosAmistad(),
                rango != null && rango.size() == 2 ? rango.get(0) : null,
                rango != null && rango.size() == 2 ? rango.get(1) : null,
                user.getIntereses(),
                user.getImagenes()
        );
    }

    public ProfileResponse getMyProfile(Authentication auth) {
        User user = getUserFromAuth(auth);
        return mapToResponse(user);
    }

    public ProfileResponse updateMyProfile(Authentication auth, ProfileUpdateRequest req) {
        User user = getUserFromAuth(auth);

        if (req.name() != null) user.setNombre(req.name());
        if (req.age() != null) user.setEdad(req.age());
        if (req.bio() != null) user.setBiografia(req.bio());
        if (req.location() != null) user.setUbicacion(req.location());
        if (req.occupation() != null) user.setOcupacion(req.occupation());
        if (req.interests() != null) user.setIntereses(req.interests());
        if (req.photos() != null) user.setImagenes(req.photos());
        if (req.lookingFor() != null) user.setLookingFor(req.lookingFor());
        if (req.gender() != null) user.setGeneroUsuario(req.gender());
        if (req.interestedInGenderRomance() != null)
            user.setGenerosRomance(req.interestedInGenderRomance());
        if (req.interestedInGenderFriendship() != null)
            user.setGenerosAmistad(req.interestedInGenderFriendship());
        if (req.ageRangeMin() != null && req.ageRangeMax() != null)
            user.setRangoEdad(List.of(req.ageRangeMin(), req.ageRangeMax()));

        userRepository.save(user);
        return mapToResponse(user);
    }

    private User getUserFromAuth(Authentication auth) {
        String userId = auth.getName();
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    //BORRADO CORRECTO EN CASCADA
    public void deleteMyAccount(Authentication auth) {
        String userId = auth.getName();

        //Buscar conversaciones donde participa
        List<Conversation> conversations =
                conversationRepository.findByUserAIdOrUserBId(userId, userId);

        //Borrar mensajes de esas conversaciones
        List<String> conversationIds = conversations.stream()
                .map(Conversation::getId)
                .toList();

        if (!conversationIds.isEmpty()) {
            messageRepository.deleteByConversationIdIn(conversationIds);
        }

        //Borrar conversaciones
        conversationRepository.deleteByUserAIdOrUserBId(userId, userId);

        //Borrar usuario
        userRepository.deleteById(userId);
    }
}