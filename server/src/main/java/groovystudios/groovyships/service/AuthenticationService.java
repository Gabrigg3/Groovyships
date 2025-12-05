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

    private final UserRepository userRepo;
    private final RefreshTokenRepository refreshRepo;
    private final PasswordEncoder passwordEncoder;

    private final String jwtSecret = "SuperSecretoJWTKey"; // cambiar en producción
    private final long jwtExpirationMs = 1000 * 60 * 15; // 15 min
    private final long refreshExpirationMs = 1000 * 60 * 60 * 24 * 2; // 2 días

    public AuthenticationService(UserRepository userRepo, RefreshTokenRepository refreshRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.refreshRepo = refreshRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }
    public User findUserById(String id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

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
        RefreshToken refreshToken = new RefreshToken(token, user.getId(), Instant.now().plusMillis(refreshExpirationMs));
        return refreshRepo.save(refreshToken);
    }

    public User login(String email, String password) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        return user;
    }

    public RefreshToken refreshToken(String token) {
        RefreshToken refreshToken = refreshRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token inválido"));
        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshRepo.delete(refreshToken);
            throw new RuntimeException("Refresh token expirado");
        }
        return refreshToken;
    }

    public void logout(String userId) {
        refreshRepo.deleteByUserId(userId);
    }
}
