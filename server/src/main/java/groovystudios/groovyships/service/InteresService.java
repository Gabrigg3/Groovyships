package groovystudios.groovyships.service;

import org.springframework.stereotype.Service;
import java.util.List;
import groovystudios.groovyships.model.Interes;
import groovystudios.groovyships.repository.InteresRepository;

@Service
public class InteresService {

    private final InteresRepository interesRepo;

    public InteresService(InteresRepository interesRepo) {
        this.interesRepo = interesRepo;
    }

    public List<Interes> getAll() {
        return interesRepo.findAll();
    }
}