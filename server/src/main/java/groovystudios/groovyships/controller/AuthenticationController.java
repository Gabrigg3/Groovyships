package groovystudios.groovyships.controller;

import groovystudios.groovyships.model.RefreshToken;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authService;

    public AuthenticationController(AuthenticationService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        User logged = authService.login(user.getEmail(), user.getPassword());
        String accessToken = authService.generateAccessToken(logged);
        RefreshToken refreshToken = authService.generateRefreshToken(logged);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken.getToken());

        return ResponseEntity.ok(tokens);
    }


    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@RequestBody Map<String, String> body) {
        String token = body.get("refreshToken");
        RefreshToken refreshToken = authService.refreshToken(token);
        User user = authService.findUserById(refreshToken.getUserId());

        String newAccess = authService.generateAccessToken(user);
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccess);
        tokens.put("refreshToken", refreshToken.getToken());

        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        authService.logout(userId);
        return ResponseEntity.ok().build();
    }
}
