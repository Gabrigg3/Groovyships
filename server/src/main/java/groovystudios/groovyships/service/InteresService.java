package groovystudios.groovyships.service;

import org.springframework.stereotype.Service;
import java.util.List;
import groovystudios.groovyships.model.Interes;
import groovystudios.groovyships.repository.InteresRepository;
import java.util.NoSuchElementException;

@Service
public class InteresService {

    private final InteresRepository interesRepo;

    public InteresService(InteresRepository interesRepo) {
        this.interesRepo = interesRepo;
    }

    public List<Interes> getAll() {
        return interesRepo.findAll();
    }


    public Interes create(Interes interes) {

        if (interesRepo.existsByNombreAndCategoria(
                interes.getNombre(),
                interes.getCategoria()
        )) {
            throw new IllegalArgumentException(
                    "Ya existe un interés con ese nombre y categoría"
            );
        }

        return interesRepo.save(interes);
    }


    public void delete(String id) {
        if (!interesRepo.existsById(id)) {
            throw new NoSuchElementException("Interés no encontrado");
        }
        interesRepo.deleteById(id);
    }

}