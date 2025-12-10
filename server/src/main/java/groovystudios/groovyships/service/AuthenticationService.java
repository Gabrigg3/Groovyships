package groovystudios.groovyships.service;


import groovystudios.groovyships.model.RefreshToken;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.repository.RefreshTokenRepository;
import groovystudios.groovyships.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class AuthenticationService {

    private final UserRepository userRepo; //Repositorio para gestionar usuarios
    private final RefreshTokenRepository refreshRepo; //Repositorio para gestionar tokens de refresco
    private final PasswordEncoder passwordEncoder; //Para encriptar contraseñas

    private final String jwtSecret = "GroovySecretJWTKey"; //Clave secreta para firmar JWTs
    private final long jwtExpirationMs = 1000 * 60 * 15; //15 min - Expiración del JWT
    private final long refreshExpirationMs = 1000 * 60 * 60 * 24 * 2; //2 días - Expiración del Refresh Token

    //Constructor
    public AuthenticationService(UserRepository userRepo, RefreshTokenRepository refreshRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.refreshRepo = refreshRepo;
        this.passwordEncoder = passwordEncoder;
    }

    //Función para registrar un nuevo usuario
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); //Encripta la contraseña antes de guardarla
        return userRepo.save(user); //Guarda el usuario en el repositorio
    }

    //Función para encontrar un usuario por su ID
    public User findUserById(String id) {
        //Busca el usuario en el repositorio por su ID
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); //Lanza excepción si no se encuentra el usuario
    }

    //Función para generar un token de acceso JWT (corto)
    public String generateAccessToken(User user) {
        //Crea y devuelve un JWT firmado con la información del usuario y la expiración configurada
        return Jwts.builder()
                .setSubject(user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    //Función para generar un token de refresco (largo)
    public RefreshToken generateRefreshToken(User user) {
        String token = UUID.randomUUID().toString(); //Genera un token aleatorio único
        RefreshToken refreshToken = new RefreshToken(token, user.getId(), Instant.now().plusMillis(refreshExpirationMs)); //Crea el objeto RefreshToken con el token, ID de usuario y fecha de expiración
        return refreshRepo.save(refreshToken); //Guarda y devuelve el token de refresco en el repositorio
    }

    //Función para iniciar sesión
    public User login(String email, String password) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado")); //Busca el usuario por email y lanza excepción si no lo encuentra
        //Verifica la contraseña proporcionada con la almacenada
        System.out.println(user.getEmail());
        System.out.println(user.getPassword());
        System.out.println(passwordEncoder.encode(password));
        System.out.println("*" + password + "*");

        if (!passwordEncoder.matches(password, user.getPassword().trim())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        return user; //Devuelve el usuario autenticado
    }

    //Función para validar y obtener un token de refresco
    public RefreshToken refreshToken(String token) {
        //Busca el token de refresco en el repositorio
        RefreshToken refreshToken = refreshRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token inválido")); //Lanza excepción si no se encuentra
        //Verifica si el token ha expirado
        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshRepo.delete(refreshToken); //Elimina el token expirado del repositorio
            throw new RuntimeException("Refresh token expirado"); //Lanza excepción de token expirado
        }
        return refreshToken; //Devuelve el token de refresco válido
    }

    //Función para cerrar sesión
    public void logout(String userId) {
        refreshRepo.deleteByUserId(userId); //Elimina todos los tokens de refresco asociados al usuario
    }
}
