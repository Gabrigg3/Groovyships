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

@Component
public class MainController {

    @FXML private ImageView photoView;
    @FXML private Label nameLabel;
    @FXML private Label locationLabel;
    @FXML private Label descriptionLabel;
    @FXML private Label interestsLabel;


    private final String CURRENT_USER_ID = "u1";
    private int currentIndex = 0;

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

    @FXML
    public void initialize() {
        loadProfile(currentIndex);
    }

    private void loadProfile(int index) {
        String[] p = profiles[index];
        nameLabel.setText(p[0] + ", " + p[1]);
        locationLabel.setText("📍 " + p[2]);
        descriptionLabel.setText(p[4]);
        interestsLabel.setText(p[5]);
        photoView.setImage(new Image(p[3]));
    }

    @FXML
    private void onLike() {
        System.out.println("💖 Like a " + profiles[currentIndex][0]);
        nextProfile();
    }

    @FXML
    private void onDislike() {
        System.out.println("❌ Pasar " + profiles[currentIndex][0]);
        nextProfile();
    }

    private void nextProfile() {
        currentIndex = (currentIndex + 1) % profiles.length;
        loadProfile(currentIndex);
    }
}