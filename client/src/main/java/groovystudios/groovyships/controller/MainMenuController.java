package groovystudios.groovyships.controller;

import groovystudios.groovyships.api.AuthApi;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class MainMenuController {
    private AuthApi authApi;
    private Stage stage;

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    @FXML
    private void openProfile() {
        loadScene("/gui/profile.fxml"); //TODO
    }

    @FXML
    private void openChats() {
        loadScene("/gui/chats.fxml"); //TODO
    }

    @FXML
    private void openMatches() {
        loadScene("/gui/matches.fxml");
    }

    private void loadScene(String fxml) {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource(fxml));
            stage.setScene(new Scene(loader.load()));
            stage.show();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setAuthApi(AuthApi authApi) {
        this.authApi = authApi;
    }
}