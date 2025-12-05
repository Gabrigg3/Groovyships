package groovystudios.groovyships.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@TypeAlias("User")
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String nombre;
    private String email;
    private Integer telefono;
    private String password;

    private Integer edad;
    private List<Integer> rangoEdad;

    private String biografia;
    private List<String> intereses;

    // 🔹 NUEVOS CAMPOS
    private String ubicacion;
    private List<String> fotoUrl;

    public User() {}

    public User(String nombre, String email, String password) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
    }

    // --- Getters y Setters ---

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getTelefono() {
        return telefono;
    }
    public void setTelefono(Integer telefono) {
        this.telefono = telefono;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getEdad() {
        return edad;
    }
    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public List<Integer> getRangoEdad() {
        return rangoEdad;
    }
    public void setRangoEdad(List<Integer> rangoEdad) {
        this.rangoEdad = rangoEdad;
    }

    public String getBiografia() {
        return biografia;
    }
    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }

    public List<String> getIntereses() {
        return intereses;
    }
    public void setIntereses(List<String> intereses) {
        this.intereses = intereses;
    }

    // 🔹 NUEVO: ubicación
    public String getUbicacion() {
        return ubicacion;
    }
    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    // 🔹 NUEVO: fotoUrl
    public List<String> getFotoUrl() {
        return fotoUrl;
    }
    public void setFotoUrl(List<String> fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
}