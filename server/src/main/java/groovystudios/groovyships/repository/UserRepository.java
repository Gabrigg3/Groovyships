package groovystudios.groovyships.repository;

import groovystudios.groovyships.model.User;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

@Document(collection = "users")
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findById(String id); //Buscar un usuario por su ID
    Optional<User> findByEmail(String username); //Buscar un usuario por su email

}
