package GroovyStudios.Groovyships.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.HashMap;

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String email;
    private Integer telefono;
    private String password;

    private Integer edad;
    private String biografia;
    private HashMap<String,Boolean> intereses;

    public User(String nombre, String email, String password) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
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

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
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

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }

    public HashMap<String, Boolean> getIntereses() {
        return intereses;
    }

    public void setIntereses(HashMap<String, Boolean> intereses) {
        this.intereses = intereses;
    }

    public void switchInteres(String interes) {
        if (this.intereses.containsKey(interes)) {
            this.intereses.put(interes, !this.intereses.get(interes));
        }
    }

}