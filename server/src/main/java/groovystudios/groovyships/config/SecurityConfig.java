package groovystudios.groovyships.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

//Configuración de seguridad de Spring Security
@Configuration
public class SecurityConfig {

    //Esto sirve para encriptar las contraseñas de los usuarios y que se guarden cifradas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) //Desactiva la protección CSRF para que no se bloqueen las peticiones POST del cliente
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll() //Lo que empiece por /auth/ será accesible SIN estar logueado
                        .anyRequest().authenticated() //Cualquier otra petición requiere autenticación
                );
        return http.build();
    }
}
