package groovystudios.groovyships.controller.v0;

import groovystudios.groovyships.dto.v0.*;
import groovystudios.groovyships.model.RefreshToken;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.service.AuthenticationService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth/v0")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthenticationController {

    private final AuthenticationService authService;

    public AuthenticationController(AuthenticationService authService) {
        this.authService = authService;
    }


    private ResponseCookie buildRefreshCookie(String token) {
        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();
    }

    //REGISTER
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {

        User user = new User();
        user.setNombre(request.nombre());
        user.setEmail(request.email());
        user.setTelefono(request.telefono());
        user.setPassword(request.password());

        user.setEdad(request.edad());
        user.setOcupacion(request.ocupacion());
        user.setUbicacion(request.ubicacion());
        user.setBiografia(request.biografia());
        user.setGeneroUsuario(request.generoUsuario());

        user.setImagenes(request.imagenes());
        user.setIntereses(request.intereses());
        user.setLookingFor(request.lookingFor());
        user.setGenerosRomance(request.generosRomance());
        user.setGenerosAmistad(request.generosAmistad());
        user.setRangoEdad(request.rangoEdad());

        User saved = authService.register(user);

        String accessToken = authService.generateAccessToken(saved);
        RefreshToken refreshToken = authService.generateRefreshToken(saved);

        ResponseCookie cookie = buildRefreshCookie(refreshToken.getToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(accessToken, saved.getId()));

    }

    //LOGIN
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

        User logged = authService.login(request.email(), request.password());

        String accessToken = authService.generateAccessToken(logged);
        RefreshToken refreshToken = authService.generateRefreshToken(logged);

        ResponseCookie cookie = buildRefreshCookie(refreshToken.getToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(accessToken, logged.getId()));

    }

    //REFRESH
    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refresh(
            @CookieValue("refreshToken") String refreshToken
    ) {
        RefreshToken stored = authService.refreshToken(refreshToken);
        User user = authService.findUserById(stored.getUserId());

        String newAccess = authService.generateAccessToken(user);

        return ResponseEntity.ok(new RefreshResponse(newAccess));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody LogoutRequest request) {

        authService.logout(request.userId());

        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity
                .noContent()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .build();
    }

}
