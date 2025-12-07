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

    //Para registrar un nuevo usuario: Recibe un JSON con los detalles del usuario (nombre, email, contraseña)
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user)); //Llama al servicio de autenticación para crear el usuario y devuelve el usuario creado.
    }

    //Para iniciar sesión: Recibe un JSON con el email y la contraseña del usuario
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        User logged = authService.login(user.getEmail(), user.getPassword()); //Llama al servicio de autenticación para verificar las credenciales del usuario.
        String accessToken = authService.generateAccessToken(logged); //Genera un token de acceso JWT para el usuario autenticado (corto).
        RefreshToken refreshToken = authService.generateRefreshToken(logged); //Genera un token de actualización para el usuario (largo).

        //Crea un mapa con ambos tokens.
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken.getToken());

        //Devuelve los tokens en la respuesta.
        return ResponseEntity.ok(tokens);
    }

    //Para refrescar el token de acceso: Recibe un JSON con el token de actualización.
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@RequestBody Map<String, String> body) {
        String token = body.get("refreshToken"); //Obtiene el token de actualización del cuerpo de la solicitud.
        RefreshToken refreshToken = authService.refreshToken(token); //Llama al servicio de autenticación para validar el token de actualización.
        User user = authService.findUserById(refreshToken.getUserId()); //Obtiene el usuario asociado al token de actualización.

        String newAccess = authService.generateAccessToken(user); //Genera un nuevo token de acceso para el usuario.
        Map<String, String> tokens = new HashMap<>(); //Crea un mapa con el nuevo token de acceso y el token de actualización existente.
        tokens.put("accessToken", newAccess);
        tokens.put("refreshToken", refreshToken.getToken());

        //Devuelve los tokens en la respuesta.
        return ResponseEntity.ok(tokens);
    }

    //Para cerrar sesión: Recibe un JSON con el ID del usuario.
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody Map<String, String> body) {
        String userId = body.get("userId"); //Obtiene el ID del usuario del cuerpo de la solicitud.
        authService.logout(userId); //Llama al servicio de autenticación para invalidar los tokens de actualización asociados al usuario.
        return ResponseEntity.ok().build(); //Devuelve una respuesta vacía indicando que la operación fue exitosa.
    }
}
