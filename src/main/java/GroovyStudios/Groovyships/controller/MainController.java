package GroovyStudios.Groovyships.controller;

import GroovyStudios.Groovyships.model.User;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Component
public class MainController {

    @FXML private ImageView photoView;
    @FXML private Label nameLabel;
    @FXML private Label locationLabel;
    @FXML private Label descriptionLabel;
    @FXML private Label interestsLabel;

    private final RestTemplate restTemplate;
    private List<User> suggestions;
    private int currentIndex = 0;

    private final String CURRENT_USER_ID = "u1";

    // ---------------------------
    // 🔹 Perfiles dummy adaptados a TU User
    // ---------------------------
    private final List<User> dummyProfiles = Arrays.asList(
            createDummy("1", "María", 27,
                    "Amante de los gatos, el café y los viajes.",
                    Arrays.asList("Animales", "Música", "Cafés bonitos")),
            createDummy("2", "Carlos", 30,
                    "Fotógrafo aficionado y amante del mar.",
                    Arrays.asList("Fotografía", "Surf", "Sushi"))
    );

    public MainController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @FXML
    public void initialize() {
        fetchSuggestions(CURRENT_USER_ID);
    }

    // ----------------------------------------------------
    // 🔹 Cargar sugerencias reales o dummy
    // ----------------------------------------------------
    private void fetchSuggestions(String userId) {
        try {
            User[] result = restTemplate.getForObject(
                    "http://localhost:8080/api/matches/suggestions/" + userId,
                    User[].class
            );

            if (result == null || result.length == 0) {
                System.out.println("⚠️ No hay usuarios → usando dummy.");
                suggestions = dummyProfiles;
            } else {
                suggestions = Arrays.asList(result);
            }
        } catch (Exception e) {
            System.out.println("❌ Error al conectar backend → usando dummy.");
            suggestions = dummyProfiles;
        }

        currentIndex = 0;
        loadProfile(currentIndex);
    }

    // ----------------------------------------------------
    // 🔹 Mostrar un perfil en pantalla
    // ----------------------------------------------------
    private void loadProfile(int index) {
        if (suggestions == null || suggestions.isEmpty()) return;

        User u = suggestions.get(index);

        // Nombre + Edad
        nameLabel.setText(u.getNombre() + ", " +
                (u.getEdad() != null ? u.getEdad() : "—"));

        // Ubicación
        locationLabel.setText("📍 " +
                (u.getUbicacion() != null ? u.getUbicacion() : "Sin ubicación"));

        // Biografía
        descriptionLabel.setText(
                u.getBiografia() != null ? u.getBiografia() : "Sin biografía"
        );

        // Intereses
        interestsLabel.setText(
                u.getIntereses() != null ? String.join(", ", u.getIntereses()) : "—"
        );

        // Foto del usuario
        if (u.getFotoUrl() != null) {
            photoView.setImage(new Image(u.getFotoUrl()));
        } else {
            photoView.setImage(new Image("https://via.placeholder.com/300"));
        }
    }

    // ----------------------------------------------------
    // 🔹 Like → MatchController
    // ----------------------------------------------------
    @FXML
    private void onLike() {
        User target = suggestions.get(currentIndex);

        System.out.println("💖 Like a " + target.getNombre());

        try {
            restTemplate.postForObject(
                    "http://localhost:8080/api/matches/" + CURRENT_USER_ID + "/like/" + target.getId(),
                    null,
                    String.class
            );
        } catch (Exception e) {
            System.out.println("⚠️ Error enviando LIKE al backend");
        }

        nextProfile();
    }

    // ----------------------------------------------------
    // 🔹 Dislike
    // ----------------------------------------------------
    @FXML
    private void onDislike() {
        User target = suggestions.get(currentIndex);
        System.out.println("❌ Dislike a " + target.getNombre());

        try {
            restTemplate.postForObject(
                    "http://localhost:8080/api/matches/" + CURRENT_USER_ID + "/dislike/" + target.getId(),
                    null,
                    String.class
            );
        } catch (Exception e) {
            System.out.println("⚠️ Error enviando DISLIKE al backend");
        }

        nextProfile();
    }

    private void nextProfile() {
        currentIndex = (currentIndex + 1) % suggestions.size();
        loadProfile(currentIndex);
    }

    // ----------------------------------------------------
    // 🔹 Dummies compatibles con tu User
    // ----------------------------------------------------
    private static User createDummy(String id, String nombre, int edad,
                                    String biografia, List<String> intereses) {

        User u = new User();
        u.setId(id);
        u.setNombre(nombre);
        u.setEdad(edad);
        u.setBiografia(biografia);
        u.setIntereses(intereses);

        return u;
    }
}