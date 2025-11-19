/*package GroovyStudios.Groovyships.controller;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import org.springframework.stereotype.Component;

@Component
public class MainController {

    @FXML
    private Label label;

    @FXML
    public void initialize() {
        System.out.println("MainController cargado correctamente");
        if (label != null) {
            label.setText("¡Hola desde JavaFX y Spring Boot! xoxo");
        }
    }
}*/

package GroovyStudios.Groovyships.controller;

import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import GroovyStudios.Groovyships.service.MatchService;
import GroovyStudios.Groovyships.repository.UserRepository;
import GroovyStudios.Groovyships.model.User;
import GroovyStudios.Groovyships.model.Match;

@Component
public class MainController {

    private static final Logger logger = LoggerFactory.getLogger(MainController.class);

    @FXML private ImageView photoView;
    @FXML private Label nameLabel;
    @FXML private Label locationLabel;
    @FXML private Label descriptionLabel;
    @FXML private Label interestsLabel;
    @FXML private Label detailsLabel;

    private int currentIndex = 0;

    // IDs para los perfiles (simulan usuarios en BD)
    private final String currentUserId = "current-user-1";
    private final String[] profileIds = {"u1", "u2"};

    private final MatchService matchService;
    private final UserRepository userRepository;

    // Datos de prueba (puedes conectar con MongoDB luego)
    private final String[][] profiles = {
            {"María", "27", "Madrid", "https://i.imgur.com/Qp7R9YH.jpeg",
                    "Amante de los gatos, el café y los viajes.",
                    "🐱 Animales, 🎶 Música, ☕ Cafés bonitos",
                    "Profesión: Arquitecta\nSigno: Libra"},
            {"Carlos", "30", "Barcelona", "https://i.imgur.com/hsQHYmh.jpeg",
                    "Fotógrafo aficionado y amante del mar.",
                    "📷 Fotografía, 🌊 Surf, 🍣 Sushi",
                    "Profesión: Ingeniero\nSigno: Tauro"}
    };

    public MainController(MatchService matchService, UserRepository userRepository) {
        this.matchService = matchService;
        this.userRepository = userRepository;
    }

    @FXML
    public void initialize() {
        // Asegurar que el usuario actual y los perfiles de prueba existen en la BD
        seedUserIfMissing(currentUserId, "Yo");
        seedUserIfMissing(profileIds[0], "María");
        seedUserIfMissing(profileIds[1], "Carlos");

        loadProfile(currentIndex);
    }

    private void seedUserIfMissing(String id, String nombre) {
        if (userRepository.findById(id).isEmpty()) {
            User u = new User(nombre, nombre.toLowerCase() + "@example.com", "password");
            u.setId(id);
            userRepository.save(u);
            System.out.println("Seeded user: " + id + " (" + nombre + ")");
        }
    }

    private void loadProfile(int index) {
        String[] p = profiles[index];
        nameLabel.setText(p[0] + ", " + p[1]);
        locationLabel.setText("📍 " + p[2]);
        descriptionLabel.setText(p[4]);
        interestsLabel.setText(p[5]);
        detailsLabel.setText(p[6]);
        photoView.setImage(new Image(p[3]));
    }

    @FXML
    private void onLike() {
        String targetId = profileIds[currentIndex];
        System.out.println("💖 Like a " + profiles[currentIndex][0] + " (id=" + targetId + ")");
        try {
            Match m = matchService.interact(currentUserId, targetId, "LIKE");
            System.out.println("Match creado: " + (m != null ? m.getId() : "(sin id)"));
        } catch (Exception e) {
            logger.error("Error al registrar like para targetId=" + targetId, e);
        }
        nextProfile();
    }

    @FXML
    private void onDislike() {
        System.out.println("❌ Pasar " + profiles[currentIndex][0]);
        try {
            String targetId = profileIds[currentIndex];
            matchService.interact(currentUserId, targetId, "DISLIKE");
        } catch (Exception e) {
            logger.error("Error al registrar dislike", e);
        }
        nextProfile();
    }

    private void nextProfile() {
        currentIndex = (currentIndex + 1) % profiles.length;
        loadProfile(currentIndex);
    }
}