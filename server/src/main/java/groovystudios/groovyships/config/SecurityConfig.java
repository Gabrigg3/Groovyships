package groovystudios.groovyships.config;

import groovystudios.groovyships.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    //Bean que define cómo se cifran las contraseñas.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //Configuración principal de Spring Security
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtFilter
    ) throws Exception {

        http
                //Desactiva CSRF porque la API usa JWT y es stateless
                .csrf(csrf -> csrf.disable())
                //Habilita CORS usando la configuración definida más abajo
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                //Indica que no se usan sesiones HTTP
                .sessionManagement(sm -> sm.sessionCreationPolicy(
                        org.springframework.security.config.http.SessionCreationPolicy.STATELESS
                ))
                //Define qué ocurre cuando alguien accede sin autenticarse
                .exceptionHandling(ex -> ex.authenticationEntryPoint((req, res, ex2) -> {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    res.setContentType("text/plain");
                    res.getWriter().write("Unauthorized");
                }))
                //Reglas de autorización de endpoints
                .authorizeHttpRequests(auth -> auth
                        //Endpoints públicos que no requieren autenticación
                        .requestMatchers(
                                "/auth/**",
                                "/ws/**",
                                "/api/v0/interests/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/actuator/**"
                        ).permitAll()
                        //Cualquier otra petición requiere JWT válido
                        .anyRequest().authenticated()
                )
                //Añade el filtro JWT antes del filtro estándar de login
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        //Construye y devuelve la cadena de filtros de seguridad
        return http.build();
    }

    //Configuración global de CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        //Orígenes permitidos para acceder a la API
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174"
        ));

        //Métodos HTTP permitidos
        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        //Permite cualquier header (incluido Authorization)
        config.setAllowedHeaders(List.of("*"));
        //Permite enviar credenciales (Authorization header)
        config.setAllowCredentials(true);

        //Aplica esta configuración CORS a todas las rutas
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);
        return source;
    }
}