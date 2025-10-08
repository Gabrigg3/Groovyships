package GroovyStudios.Groovyships.model;

import GroovyStudios.Groovyships.model.User;

import java.time.LocalDateTime;

public class Match {

    private User usuario1;
    private String status1;
    private User usuario2;
    private String status2;
    private LocalDateTime fechaMatch;

    public Match(User usuario1, User usuario2) {
        this.usuario1 = usuario1;
        this.status1 = "null";  // Puede ser "null", "LIKE" o "DISLIKE"
        this.usuario2 = usuario2;
        this.status2 = "null";  // Puede ser "null", "LIKE" o "DISLIKE"
        this.fechaMatch = LocalDateTime.now();
    }

    public User getUsuario1() {
        return usuario1;
    }
    public void setUsuario1(User usuario1) {
        this.usuario1 = usuario1;
    }

    public User getUsuario2() {
        return usuario2;
    }
    public void setUsuario2(User usuario2) {
        this.usuario2 = usuario2;
    }

    public LocalDateTime getFechaMatch() {
        return fechaMatch;
    }

    public String getStatus1() {
        return status1;
    }
    public void setStatus1(String status1) {
        this.status1 = status1;
    }

    public String getStatus2() {
        return status2;
    }
    public void setStatus2(String status2) {
        this.status2 = status2;
    }

}