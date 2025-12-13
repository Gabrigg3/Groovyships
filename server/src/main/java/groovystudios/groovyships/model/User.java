package groovystudios.groovyships.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@TypeAlias("User")
@Document(collection = "users")
public class User {

    @Id
    private String id; //ID único generado por MongoDB

    private String nombre; //Nombre del usuario
    private String email; //Email del usuario
    private Integer telefono; //Teléfono del usuario
    private String password; //Contraseña del usuario

    private Integer edad; //Edad del usuario
    private List<Integer> rangoEdad; //Rango de edad preferido para hacer match

    private String biografia; //Biografía del usuario
    private List<String> intereses; //Intereses del usuario

    private String ubicacion; //Ubicación del usuario
    private List<String> imagenes; //URLs de las fotos del usuario

    private List<String> lookingFor;   // ["romance", "amistad"]
    private String ocupacion; //La ocupación del usuario

    private String generoUsuario;
    private List<String> generosRomance;
    private List<String> generosAmistad;

    //Constructor vacío necesario para MongoDB
    public User() {}

    //Constructor completo
    public User(String nombre, String email, String password) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
    }

    //Getters y Setters
    @JsonProperty("id")
    public String getId() {
        return this.id;
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

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public List<String> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<String> imagenes) {
        this.imagenes = imagenes;
    }

    public List<String> getLookingFor() {
        return lookingFor;
    }

    public void setLookingFor(List<String> lookingFor) {
        this.lookingFor = lookingFor;
    }

    public String getOcupacion() {
        return ocupacion;
    }

    public void setOcupacion(String ocupacion) {
        this.ocupacion = ocupacion;
    }
}