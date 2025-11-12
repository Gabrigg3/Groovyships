package GroovyStudios.Groovyships;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class GroovyshipsApplication extends Application {

    private ConfigurableApplicationContext springContext;

    public static void main(String[] args) {
        // Lanza la aplicación JavaFX
        Application.launch(args);
    }

    @Override
    public void init() {
        // Inicia el contexto de Spring Boot
        springContext = new SpringApplicationBuilder(GroovyshipsApplication.class).run();
    }

    @Override
    public void start(Stage stage) throws Exception {
        System.out.println("Iniciando interfaz JavaFX...");
        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("/GUI/main.fxml"));
        fxmlLoader.setControllerFactory(springContext::getBean);
        Scene scene = new Scene(fxmlLoader.load(), 600, 400);
        stage.setTitle("Groovyships");
        stage.setScene(scene);
        stage.show();
    }

    @Override
    public void stop() {
        springContext.close();
    }
}

