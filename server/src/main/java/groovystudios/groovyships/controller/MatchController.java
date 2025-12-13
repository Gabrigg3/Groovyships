package groovystudios.groovyships.controller;

import groovystudios.groovyships.model.Match;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.service.MatchService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    private final MatchService matchService;

    //Constructor para inyectar el servicio de Match
    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    //Endpoint para obtener sugerencias de usuarios para hacer match
    @GetMapping("/suggestions/{userId}")
    public List<Map<String, Object>> getSuggestions(@PathVariable String userId) {

        return matchService.getSuggestions(userId).stream()
                .map(u -> Map.of(
                        "id", u.getId(),
                        "nombre", u.getNombre(),
                        "edad", u.getEdad(),
                        "ubicacion", u.getUbicacion(),
                        "biografia", u.getBiografia(),
                        "intereses", u.getIntereses(),
                        "imagenes", u.getImagenes(),
                        "ocupacion", u.getOcupacion(),
                        "lookingFor", u.getLookingFor() != null ? u.getLookingFor() : List.of()
                ))
                .toList();
    }

    //Endpoint para indicar que un usuario le gusta a otro
    @PostMapping("/{userId}/like/{targetId}")
    public Match likeUser(@PathVariable String userId, @PathVariable String targetId) {
        return matchService.interact(userId, targetId, "LIKE");
    }

    //Endpoint para indicar que un usuario no le gusta a otro
    @PostMapping("/{userId}/dislike/{targetId}")
    public Match dislikeUser(@PathVariable String userId, @PathVariable String targetId) {
        return matchService.interact(userId, targetId, "DISLIKE");
    }

    //Endpoint para obtener todos los matches de un usuario
    @GetMapping("/{userId}")
    public List<Match> getMatches(@PathVariable String userId) {
        return matchService.getMatchesForUser(userId);
    }

    //Endpoint para obtener todos los matches en el sistema (para administración o pruebas)
    @GetMapping("/all")
    public List<Match> getAllMatches() {
        return matchService.getAllMatches();
    }
}
