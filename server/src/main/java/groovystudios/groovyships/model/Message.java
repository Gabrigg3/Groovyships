package groovystudios.groovyships.model;

import org.springframework.data.annotation.Id;

import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
    public class Message {
        @Id
        private Long id; //ID único generado por MongoDB

        private Match match; //El match al que pertenece el mensaje

        private User sender; //El usuario que envía el mensaje

        private String content; //Contenido del mensaje

        private LocalDateTime sentAt = LocalDateTime.now(); //Fecha y hora en que se envió el mensaje

        //Getters y setters
        public Long getId() {
            return id;
        }
        public void setId(Long id) {
            this.id = id;
        }
        public Match getMatch() {
            return match;
        }
        public void setMatch(Match match) {
            this.match = match;
        }
        public User getSender() {
            return sender;
        }
        public void setSender(User sender) {
            this.sender = sender;
        }
        public String getContent() {
            return content;
        }
        public void setContent(String content) {
            this.content = content;
        }
        public LocalDateTime getSentAt() {
            return sentAt;
        }
        public void setSentAt(LocalDateTime sentAt) {
            this.sentAt = sentAt;
        }
 }

