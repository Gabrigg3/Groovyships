package groovystudios.groovyships.api;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import groovystudios.groovyships.model.UserLight;

import java.lang.reflect.Type;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;


import static java.lang.System.in;

public class ClientApi {

    private final String serverUrl = "http://localhost:8080";
    private final HttpClient httpClient = HttpClient.newHttpClient();

    // ---------------------------
    // GET → Obtener usuarios sugeridos
    // ---------------------------
    public List<UserLight> getSuggestions(String userId) {

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(serverUrl + "/api/matches/suggestions/" + userId))
                    .GET()
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            // Si la respuesta no es 200 → devolvemos null
            if (response.statusCode() != 200) {
                System.out.println("❌ Error al obtener sugerencias: " + response.statusCode());
                return null;
            }

            String json = response.body();

            // Convertir JSON → Lista de UserLight
            Gson gson = new Gson();
            Type type = new TypeToken<List<UserLight>>(){}.getType();

            return gson.fromJson(json, type);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // ---------------------------
    // POST → Enviar LIKE
    // ---------------------------
    public boolean sendLike(String userId, String targetId) {
        return sendPost("/api/matches/" + userId + "/like/" + targetId);
    }

    // ---------------------------
    // POST → Enviar DISLIKE
    // ---------------------------
    public boolean sendDislike(String userId, String targetId) {
        return sendPost("/api/matches/" + userId + "/dislike/" + targetId);
    }

    // ---------------------------
    // Función interno para POST
    // ---------------------------
    private boolean sendPost(String path) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(serverUrl + path))
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .header("Content-Type", "application/json")
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            return response.statusCode() >= 200 && response.statusCode() < 300;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}