package groovystudios.groovyships;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class ClientApplication extends Application {

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {

        // Cargar la pantalla de Login al iniciar la aplicación
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/gui/fxml/login.fxml"));
        Parent root = loader.load();

        //Obtener controlador y pasarle el Stage
        LoginController controller = loader.getController();
        controller.setStage(stage);

        Scene scene = new Scene(loader.load());

        stage.setTitle("Groovyships - Login");
        stage.setScene(scene);
        stage.show();
    }
}