package groovystudios.groovyships.controller;

import javafx.fxml.FXML;
import javafx.scene.control.TextField;
import javafx.scene.control.PasswordField;
import javafx.stage.Stage;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.Parent;

public class Register1Controller {

    @FXML private TextField nameField;
    @FXML private TextField emailField;
    @FXML private PasswordField passwordField;
    @FXML private PasswordField confirmPasswordField;

    private Stage stage;

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    @FXML
    private void onNext() {

        if (nameField.getText().isBlank() ||
                emailField.getText().isBlank() ||
                passwordField.getText().isBlank() ||
                !passwordField.getText().equals(confirmPasswordField.getText())) {

            System.out.println("❌ Datos inválidos en el paso 1");
            return;
        }

        goToRegister2();
    }

    private void goToRegister2() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/gui/fxml/register2.fxml"));
            Parent root = loader.load();

            // ✔️ Pasar Stage al siguiente controlador
            Register2Controller controller = loader.getController();
            controller.setStage(stage);

            stage.setScene(new Scene(root));
            stage.show();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    private void goToLogin() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/gui/fxml/login.fxml"));
            Parent root = loader.load();

            // ✔️ Pasar Stage al LoginController
            LoginController controller = loader.getController();
            controller.setStage(stage);

            stage.setScene(new Scene(root));
            stage.show();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}