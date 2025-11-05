package GroovyStudios.Groovyships.repository;

import GroovyStudios.Groovyships.model.User;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Document(collection = "users")
public interface UserRepository extends MongoRepository<User, String> {


    Optional<User> findById(String id);


}
