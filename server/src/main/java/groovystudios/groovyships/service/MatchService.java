package groovystudios.groovyships.service;

import groovystudios.groovyships.model.Match;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.repository.MatchRepository;
import groovystudios.groovyships.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MatchService {

    private final MatchRepository matchRepo; //Repositorio para manejar los matches entre usuarios
    private final UserRepository userRepo; //Repositorio para manejar los usuarios

    //Constructor
    public MatchService(MatchRepository matchRepo, UserRepository userRepo) {
        this.matchRepo = matchRepo;
        this.userRepo = userRepo;
    }

    //Función para obtener todos los matches de un usuario específico
    public List<Match> getMatchesForUser(String userId) {
        User user = userRepo.findById(userId).orElseThrow(); //Buscar el usuario por su ID
        return matchRepo.findByUsuarioOrTarget(user, user); //Se devuelven todos los matches donde el usuario es usuario1 o usuario2
    }

    //Función para interactuar con otro usuario (LIKE o DISLIKE)
    public Match interact(String userId, String targetId, String action) {
        User user = userRepo.findById(userId).orElseThrow(); //Busca el usuario que realiza la acción
        User target = userRepo.findById(targetId).orElseThrow(); //Busca el usuario objetivo de la acción

        //Verifica si ya existe una interacción previa entre los dos usuarios
        Optional<Match> existing = matchRepo.findByUsuarioAndTarget(target, user);

        //Crear una nueva interacción
        Match newInteraction = null;

        //Si ya existe una interacción previa y la acción es "LIKE":
        if (action.equals("LIKE")) {
            newInteraction= new Match(user, target, "LIKE"); //Crea un nuevo match con estado "LIKE"
        //Si la acción es "DISLIKE":
        } else if (action.equals("DISLIKE")) {
            newInteraction= new Match(user, target, "DISLIKE"); //Crea un nuevo match con estado "DISLIKE"
        }

        //Guarda la nueva interacción en el repositorio
        matchRepo.save(newInteraction);
        return newInteraction; //Devuelve la nueva interacción creada

    }

    //Función para obtener sugerencias de usuarios para hacer match
    public List<User> getSuggestions(String userId) {
        //Obtenemoa el usuario actual
        User user = userRepo.findById(userId).orElseThrow();
        //Obtenemos todas las interacciones del usuario
        List<Match> interactions = matchRepo.findByUsuarioOrTarget(user, user);

        //Obtenemos los IDs de los usuarios con los que ya ha interactuado
        List<String> interactedUserIds = interactions.stream().map(match -> {
            //Determina cuál de los dos usuarios en el match no es el usuario actual y devuelve su ID
            if (match.getUsuario().getId().equals(userId)) {
                return match.getUsuario2().getId();
            } else {
                return match.getUsuario().getId();
            }
        }).toList();

        //Obtener los usuarios cuya edad está dentro del rango, comparte intereses y buscan lo mismo.
        //List<Long> sharedUsers = userRepo.findUsersToInteract(userId);

        //Filtra los usuarios que no son el usuario actual y con los que no ha interactuado
        return userRepo.findAll().stream()
                .filter(u -> !u.getId().equals(userId))       //Que no sea él mismo
                .filter(u -> !interactedUserIds.contains(u.getId()))  //Que no haya repetidos
                .toList();
    }

    //Función para obtener todos los matches en el sistema
    public List<Match> getAllMatches() {
        return matchRepo.findAll();
    }
}