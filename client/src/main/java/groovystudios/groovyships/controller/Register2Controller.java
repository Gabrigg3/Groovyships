package groovystudios.groovyships.controller;

import javafx.fxml.FXML;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import javafx.fxml.FXMLLoader;

public class Register2Controller {

    @FXML private TextField phoneField;
    @FXML private TextField ageField;
    @FXML private TextField locationField;
    @FXML private TextField photoField;
    @FXML private TextField ageRangeField;
    @FXML private TextField bioField;
    @FXML private TextField interestsField;
    private Stage stage;

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    @FXML
    private void onFinish() {

        if (ageField.getText().isBlank() || photoField.getText().isBlank()) {
            System.out.println("❌ Edad y foto son obligatorias");
            return;
        }

        // TODO: enviar datos al servidor

        goToMainMenu();
    }

    private void goToMainMenu() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/gui/fxml/main_menu.fxml"));
            Parent root = loader.load();

            // ✔️ Obtener el controlador del menú para pasarle también el Stage
            MainMenuController controller = loader.getController();
            controller.setStage(stage);

            stage.setScene(new Scene(root));
            stage.show();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}