package groovystudios.groovyships.repository;

import groovystudios.groovyships.model.Interes;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InteresRepository extends MongoRepository<Interes, String> {

    // Obtener intereses por categoría
    List<Interes> findByCategoria(String categoria);

    // Comprobar si existe un interés por nombre y categoría (útil para seeds)
    boolean existsByNombreAndCategoria(String nombre, String categoria);

    Optional<Interes> findById(String id);
}