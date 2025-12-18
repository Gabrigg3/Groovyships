package groovystudios.groovyships.controller.v0;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import groovystudios.groovyships.model.Interes;
import groovystudios.groovyships.service.InteresService;

@RestController
@RequestMapping("/api/v0/interests")
public class InteresController {

    private final InteresService interesService;

    public InteresController(InteresService interesService) {
        this.interesService = interesService;
    }

    @GetMapping
    public List<Interes> getAllInterests() {
        return interesService.getAll();
    }


    @PostMapping
    public Interes createInterest(@RequestBody Interes interes) {
        return interesService.create(interes);
    }

    @DeleteMapping("/{id}")
    public void deleteInterest(@PathVariable String id) {
        interesService.delete(id);
    }


}