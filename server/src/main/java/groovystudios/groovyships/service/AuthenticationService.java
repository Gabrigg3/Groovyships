package groovystudios.groovyships.service;

import groovystudios.groovyships.model.RefreshToken;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.repository.RefreshTokenRepository;
import groovystudios.groovyships.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class AuthenticationService {

    private final UserRepository userRepo;
    private final RefreshTokenRepository refreshRepo;
    private final PasswordEncoder passwordEncoder;

    private final String jwtSecret = "GroovyshipsGroovyJsonGroovyWebGroovyTokenGN";
    private final long jwtExpirationMs = 1000 * 60 * 30; // 30 minutos
    private final long refreshExpirationMs = 1000 * 60 * 60 * 24 * 2; // 2 días

    @Autowired
    private SequenceGeneratorService sequenceGenerator;

    public AuthenticationService(UserRepository userRepo, RefreshTokenRepository refreshRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.refreshRepo = refreshRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // REGISTRO
    public User register(User user) {

        // Asignar ID secuencial u001, u002…
        long nextId = sequenceGenerator.getNextSequenceId("userId");
        String formattedId = String.format("u%03d", nextId);
        user.setId(formattedId);

        // Encriptar contraseña correctamente
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepo.save(user);
    }

    public User findUserById(String id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }


    // GENERAR JWT
    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    public RefreshToken generateRefreshToken(User user) {
        String token = UUID.randomUUID().toString();
        RefreshToken refresh = new RefreshToken(
                token,
                user.getId(),
                Instant.now().plusMillis(refreshExpirationMs)
        );
        return refreshRepo.save(refresh);
    }


    // LOGIN
    public User login(String email, String password) {

        if (email == null || password == null) {
            throw new RuntimeException("Email o contraseña inválidos");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return user;
    }


    // VALIDAR REFRESH TOKEN
    public RefreshToken refreshToken(String token) {

        RefreshToken refreshToken = refreshRepo.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token inválido"));


        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshRepo.delete(refreshToken);
            throw new RuntimeException("Refresh token expirado");
        }

        return refreshToken;
    }

    public void logout(String userId) {
        refreshRepo.deleteByUserId(userId);
    }



    public User validateAccessToken(String token) {

        // Parsea el JWT y obtiene los claims
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

        String userId = claims.getSubject();

        if (userId == null) {
            throw new RuntimeException("Token sin usuario");
        }

        return findUserById(userId);
    }

}