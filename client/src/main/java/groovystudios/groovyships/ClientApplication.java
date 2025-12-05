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

        FXMLLoader loader = new FXMLLoader(getClass().getResource("/gui/fxml/main.fxml"));
        Scene scene = new Scene(loader.load());

        stage.setTitle("Groovyships Client");
        stage.setScene(scene);
        stage.show();
    }
}