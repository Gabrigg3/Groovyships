package groovystudios.groovyships.controller;

import groovystudios.groovyships.model.User;
import groovystudios.groovyships.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")

public class UserController {
    @Autowired
    private UserRepository userRepository;



    //Endpoint para crear un nuevo usuario
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    //Endpoint para obtener todos los usuarios
    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }

}
