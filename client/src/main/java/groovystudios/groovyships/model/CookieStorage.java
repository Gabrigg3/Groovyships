package groovystudios.groovyships.model;

import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.HttpCookie;

public class CookieStorage {

    private static CookieManager cookieManager;

    static {
        cookieManager = new CookieManager();
        cookieManager.setCookiePolicy(CookiePolicy.ACCEPT_ALL);
        // Register the cookie manager globally
        java.net.CookieHandler.setDefault(cookieManager);
    }

    public static void saveRefreshToken(String token) {
        HttpCookie cookie = new HttpCookie("refreshToken", token);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // ponlo true si usas HTTPS
        cookie.setMaxAge(60 * 60 * 24 * 7); // 7 días

        cookieManager.getCookieStore().add(null, cookie);
    }

    public static String getRefreshToken() {
        return cookieManager.getCookieStore().getCookies().stream()
                .filter(c -> c.getName().equals("refreshToken"))
                .findFirst()
                .map(HttpCookie::getValue)
                .orElse(null);
    }

    public static void deleteRefreshToken() {
        cookieManager.getCookieStore().removeAll();
    }
}
