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

public class MatchesApi {

    private final String serverUrl = "http://localhost:8080";
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final AuthApi auth;


    public MatchesApi(AuthApi authClient) {
        this.auth = authClient;
    }
    // ---------------------------
    // GET → Obtener usuarios sugeridos
    // ---------------------------
    public List<UserLight> getSuggestions(String userId) {

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(serverUrl + "/api/matches/suggestions/" + userId))
                    .header("Authorization", "Bearer " + auth.getAccessToken())
                    .GET()
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 401) {
                auth.refreshAccessToken();
                return getSuggestions(userId); // reintentar
            }
            // Si la respuesta no es 200 → devolvemos null
            else if (response.statusCode() != 200) {
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
                    .header("Authorization", "Bearer " + auth.getAccessToken())
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .header("Content-Type", "application/json")
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 401) {
                auth.refreshAccessToken();
                return sendPost(path); // reintentar
            }

            return response.statusCode() >= 200 && response.statusCode() < 300;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }



}