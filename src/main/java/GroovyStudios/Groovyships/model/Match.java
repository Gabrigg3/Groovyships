package GroovyStudios.Groovyships.model;

import GroovyStudios.Groovyships.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "matches")
public class Match {


    @Id
    public String id;

    //la clave primaria son los dos usuarios
    private User usuario;
    private String status;
    private User objetivo;
    private LocalDateTime fechaMatch;

    public Match(User usuario, User target, String status) {
        this.usuario = usuario;
        this.status = status;  // Puede ser "null", "LIKE" o "DISLIKE"
        this.objetivo = target;
        this.fechaMatch = LocalDateTime.now();
    }

    public Match() {

    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public User getUsuario() {
        return usuario;
    }
    public void setUsuario1(User usuario1) {
        this.usuario = usuario1;
    }

    public User getUsuario2() {
        return objetivo;
    }
    public void setUsuario2(User usuario2) {
        this.objetivo = usuario2;
    }

    public LocalDateTime getFechaMatch() {
        return fechaMatch;
    }

    public String getStatus1() {
        return status;
    }
    public void setStatus1(String status1) {
        this.status = status1;
    }

}