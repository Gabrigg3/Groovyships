package groovystudios.groovyships.controller;

import groovystudios.groovyships.api.AuthApi;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.control.TextField;
import javafx.scene.control.PasswordField;
import javafx.stage.Stage;
import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;

public class LoginController {

    @FXML private TextField emailField;
    @FXML private PasswordField passwordField;

    private final AuthApi authApi = new AuthApi();

    private Stage stage;

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    @FXML
    private void onLogin(ActionEvent event) {
        String email = emailField.getText();
        String pass = passwordField.getText();


        if(authApi.login(email, pass)){
            goToMainMenu(event);
        }
        else{
            System.out.println("Invalid email or password");
        }

    }

    @FXML
    private void goToRegister(ActionEvent event) {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/gui/fxml/register1.fxml"));
            Parent root = loader.load();

            //Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            //Stage stage = (Stage) emailField.getScene().getWindow();

            // Pasar el Stage al siguiente controller
            Register1Controller controller = loader.getController();
            controller.setStage(stage);

            stage.setScene(new Scene(root));
            stage.show();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void goToMainMenu(ActionEvent event) {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/gui/fxml/main_menu.fxml"));
            Parent root = loader.load();

            MainMenuController controller = loader.getController();
            controller.setAuthApi(authApi);

            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.setScene(new Scene(root));
            stage.show();

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}