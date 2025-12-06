package groovystudios.groovyships.controller;

import groovystudios.groovyships.model.UserLight;
import groovystudios.groovyships.api.MatchesApi;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;

import java.util.Arrays;
import java.util.List;

public class MatchesController {

    @FXML private ImageView photoView;
    @FXML private Label nameLabel;
    @FXML private Label locationLabel;
    @FXML private Label descriptionLabel;
    @FXML private Label interestsLabel;

    private final MatchesApi matchesApi = new MatchesApi();

    private final String CURRENT_USER_ID = "u2";
    private List<UserLight> suggestions;
    private int currentIndex = 0;

    // Dummy temporal (por si Mongo está vacío)
    private final List<UserLight> dummyProfiles = Arrays.asList(
            createDummy("1", "María", 27, "Madrid",
                    "Amante de los gatos, el café y los viajes.",
                    Arrays.asList("Animales", "Música", "Café"),
                    "https://i.imgur.com/Qp7R9YH.jpeg"),
            createDummy("2", "Carlos", 30, "Barcelona",
                    "Fotógrafo aficionado.",
                    Arrays.asList("Surf", "Foto", "Sushi"),
                    "https://i.imgur.com/hsQHYmh.jpeg")
    );
    public MatchesController() {}


    @FXML
    public void initialize() {

        // Obtener sugerencias desde MongoDB
        suggestions = matchesApi.getSuggestions(CURRENT_USER_ID);

        if (suggestions == null || suggestions.isEmpty()) {
            System.out.println("⚠️ No hay usuarios en MongoDB → usando perfiles dummy.");
            suggestions = dummyProfiles;
        }

        loadProfile();
    }

    // -----------------------------
    // Mostrar perfil
    // -----------------------------
    private void loadProfile() {
        UserLight u = suggestions.getFirst();

        nameLabel.setText(u.getNombre() + ", " +
                (u.getEdad() != null ? u.getEdad() : "—"));

        locationLabel.setText("📍 " +
                (u.getUbicacion() != null ? u.getUbicacion() : "Sin ubicación"));

        descriptionLabel.setText(
                u.getBiografia() != null ? u.getBiografia() : "Sin biografía"
        );

        interestsLabel.setText(
                u.getIntereses() != null ? String.join(", ", u.getIntereses()) : "—"
        );

        String foto = u.getFotoUrl() != null ? u.getFotoUrl() : "https://via.placeholder.com/300";
        photoView.setImage(new Image(foto));
    }

    // -----------------------------
    // Like / Dislike
    // -----------------------------
    @FXML
    private void onLike() {
        UserLight target = suggestions.getFirst();
        matchesApi.sendLike(CURRENT_USER_ID, target.getId());
        suggestions.removeFirst();
        nextProfile();
    }

    @FXML
    private void onDislike() {
        UserLight target = suggestions.get(currentIndex);
        matchesApi.sendDislike(CURRENT_USER_ID, target.getId());
        suggestions.removeFirst();
        nextProfile();
    }

    private void nextProfile() {
        if(!suggestions.isEmpty()) loadProfile();
        else{
            System.out.println("Ya has visto a todas las personas");
        }
    }

    //Dummy constructor
    private static UserLight createDummy(
            String id, String nombre, int edad, String ubicacion,
            String biografia, List<String> intereses, String fotoUrl
    ) {
        UserLight u = new UserLight();
        u.setId(id);
        u.setNombre(nombre);
        u.setEdad(edad);
        u.setUbicacion(ubicacion);
        u.setBiografia(biografia);
        u.setIntereses(intereses);
        u.setFotoUrl(fotoUrl);
        return u;
    }
}