package groovystudios.groovyships.model;

import org.springframework.data.annotation.Id;

import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
    public class Message {
        @Id
        private Long id;

        private Match match;


        private User sender;

        private String content;

        private LocalDateTime sentAt = LocalDateTime.now();

        // Getters y setters
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

