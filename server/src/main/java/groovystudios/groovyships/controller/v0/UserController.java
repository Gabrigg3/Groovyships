package groovystudios.groovyships.controller.v0;

import groovystudios.groovyships.dto.v0.UserResponse;
import groovystudios.groovyships.mapper.v0.UserMapper;
import groovystudios.groovyships.model.User;
import groovystudios.groovyships.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v0/usuarios")

public class UserController {
    @Autowired
    private UserRepository userRepository;



    //Endpoint para obtener todos los usuarios
    @GetMapping
    public List<UserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    @GetMapping("/{userId}")
    public UserResponse getUser(@PathVariable String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return UserMapper.toResponse(user);
    }
}
