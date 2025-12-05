package groovystudios.groovyships.model;

import java.util.List;
import com.google.gson.Gson;

import java.lang.reflect.Type;
import com.google.gson.reflect.TypeToken;

public class UserLight {

    private String id;

    private String nombre;

    private Integer edad;
    private List<Integer> rangoEdad;

    private String biografia;
    private List<String> intereses;

    private String ubicacion;
    private String fotoUrl;


    public UserLight() {}

    public UserLight(String nombre) {
        this.nombre = nombre;
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

    public String getFotoUrl() {
        return fotoUrl;
    }
    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }



    public static List<UserLight> parseList(String json) {
        Gson gson = new Gson();
        Type listType = new TypeToken<List<UserLight>>(){}.getType();
        return gson.fromJson(json, listType);
    }

}