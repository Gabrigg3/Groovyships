package groovystudios.groovyships.api;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class AuthApi {

    private final HttpClient client = HttpClient.newHttpClient();
    private final String serverUrl = "http://localhost:8080";

    private String accessToken;

    public boolean login(String email, String password) {
        try {
            String json = """
            { "email": "%s", "password": "%s" }
        """.formatted(email, password);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(serverUrl + "/auth/login"))
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .header("Content-Type", "application/json")
                    .build();

            HttpResponse<String> response =
                    client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                System.out.println("❌ Login falló");
                System.out.println(response.body());
                return false;
            }

            // Parsear JSON manualmente
            JsonObject jsonObject = JsonParser.parseString(response.body()).getAsJsonObject();

            // Guardar access token
            this.accessToken = jsonObject.get("accessToken").getAsString();

            // Guardar refresh token en CookieStorage
            String refreshToken = jsonObject.get("refreshToken").getAsString();
            CookieStorage.setCookie("refresh_token", refreshToken);

            System.out.println("✅ Login OK");
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }



    public void refreshAccessToken() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(serverUrl + "/auth/refresh"))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            Gson gson = new Gson();
            AuthResponse auth = gson.fromJson(response.body(), AuthResponse.class);
            this.accessToken = auth.getAccessToken();
        } else {
            throw new RuntimeException("Refresh falló");
        }
    }

    public String getAccessToken() {
        return accessToken;
    }
}