package groovystudios.groovyships.controller;

import groovystudios.groovyships.model.RefreshToken;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.service.AuthenticationService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String password = body.get("password");

        User logged = authService.login(email, password);

        String accessToken = authService.generateAccessToken(logged);
        RefreshToken refreshToken = authService.generateRefreshToken(logged);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                .httpOnly(true)
                .secure(false) // PONLO EN TRUE SI USAS HTTPS
                .path("/auth/refresh")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("accessToken", accessToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@RequestBody Map<String, String> body) {

        String token = body.get("refreshToken");

        RefreshToken stored = authService.refreshToken(token);
        User user = authService.findUserById(stored.getUserId());

        String newAccess = authService.generateAccessToken(user);

        return ResponseEntity.ok(
                Map.of(
                        "accessToken", newAccess,
                        "refreshToken", stored.getToken()
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody Map<String, String> body) {

        String userId = body.get("userId");
        authService.logout(userId);

        return ResponseEntity.ok().build();
    }
}