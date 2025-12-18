package groovystudios.groovyships.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "interests")
public class Interes {

    @Id
    private String id;

    // Nombre visible del interés (ej: "Fútbol", "Yoga")
    private String nombre;

    // Categoría a la que pertenece (ej: "Deportes", "Arte y Cultura")
    private String categoria;


    // Constructor vacío requerido por MongoDB
    public Interes() {
    }

    // Constructor principal
    public Interes(String nombre, String categoria) {
        this.nombre = nombre;
        this.categoria = categoria;
    }


    // GETTERS & SETTERS
    public String getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
}