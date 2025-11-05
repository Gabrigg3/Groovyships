package GroovyStudios.Groovyships.controller;

import org.springframework.stereotype.Service;

import GroovyStudios.Groovyships.model.Match;
import GroovyStudios.Groovyships.model.User;
import GroovyStudios.Groovyships.service.MatchService;

import org.springframework.stereotype.Service;



import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/suggestions/{userId}")
    public List<User> getSuggestions(@PathVariable Long userId) {
        return matchService.getSuggestions(userId);
    }

    @PostMapping("/{userId}/like/{targetId}")
    public Match likeUser(@PathVariable Long userId, @PathVariable Long targetId) {
        return matchService.interact(userId, targetId, "LIKE");
    }

    @PostMapping("/{userId}/dislike/{targetId}")
    public Match dislikeUser(@PathVariable Long userId, @PathVariable Long targetId) {
        return matchService.interact(userId, targetId, "DISLIKE");
    }

    @GetMapping("/{userId}")
    public List<Match> getMatches(@PathVariable Long userId) {
        return matchService.getMatchesForUser(userId);
    }
}
