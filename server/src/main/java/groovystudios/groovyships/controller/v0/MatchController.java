package groovystudios.groovyships.controller.v0;

import groovystudios.groovyships.dto.v0.MatchResponse;
import groovystudios.groovyships.dto.v0.MatchSuggestionResponse;
import groovystudios.groovyships.model.Match;
import groovystudios.groovyships.service.MatchService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v0/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    private final MatchService matchService;

    //Constructor para inyectar el servicio de Match
    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    //Endpoint para obtener sugerencias de usuarios para hacer match
    @GetMapping("/suggestions/{userId}")
    public List<MatchSuggestionResponse> getSuggestions(@PathVariable String userId) {
        return matchService.getSuggestions(userId).stream()
                .map(u -> new MatchSuggestionResponse(
                        u.getId(),
                        u.getNombre(),
                        u.getEdad(),
                        u.getGeneroUsuario(),
                        u.getUbicacion(),
                        u.getBiografia(),
                        u.getIntereses(),
                        u.getImagenes(),
                        u.getOcupacion(),
                        u.getLookingFor() != null ? u.getLookingFor() : List.of()
                ))
                .toList();
    }

    //Endpoint para indicar que un usuario le gusta a otro
    @PostMapping("/{userId}/like/{targetId}")
    public MatchResponse likeUser(@PathVariable String userId, @PathVariable String targetId) {
        Match match = matchService.interact(userId, targetId, "LIKE");
        return new MatchResponse(
                match.getId(),
                match.getUsuario().getId(),
                match.getUsuario2().getId(),
                match.getStatus1()
        );
    }

    //Endpoint para indicar que un usuario no le gusta a otro
    @PostMapping("/{userId}/dislike/{targetId}")
    public MatchResponse dislikeUser(@PathVariable String userId,@PathVariable String targetId) {
        Match match = matchService.interact(userId, targetId, "DISLIKE");

        return new MatchResponse(
                match.getId(),
                match.getUsuario().getId(),
                match.getUsuario2().getId(),
                match.getStatus1()
        );
    }

    //Endpoint para obtener todos los matches de un usuario
    @GetMapping("/{userId}")
    public List<MatchResponse> getMatches(@PathVariable String userId) {
        return matchService.getMatchesForUser(userId).stream()
                .map(match -> new MatchResponse(
                        match.getId(),
                        match.getUsuario().getId(),
                        match.getUsuario2().getId(),
                        match.getStatus1()
                ))
                .toList();
    }
    //Endpoint para obtener todos los matches en el sistema (para administración o pruebas)
    @GetMapping("/all")
    public List<MatchResponse> getAllMatches() {
        return matchService.getAllMatches().stream()
                .map(match -> new MatchResponse(
                        match.getId(),
                        match.getUsuario().getId(),
                        match.getUsuario2().getId(),
                        match.getStatus1()
                ))
                .toList();
    }


    @DeleteMapping("/{userId}/break/{targetId}")
    public void breakMatch(
            @PathVariable String userId,
            @PathVariable String targetId
    ) {
        matchService.breakMatch(userId, targetId);
    }
}
