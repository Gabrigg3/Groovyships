package groovystudios.groovyships.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoConfig {

    //Definimos la URL de la base de datos MongoDB
    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb+srv://GroovyStudios:mMT4G7bSeHvMTWsq@groovydb.uyyelq9.mongodb.net/miapp?retryWrites=true&w=majority");
    }

    //Definimos el MongoTemplate para interactuar con la base de datos
    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "miapp");
    }
}