package tn.esprit.pi.services;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.logging.Logger;

@Service
public class GoogleAuthService {
    private static final Logger LOGGER = Logger.getLogger(GoogleAuthService.class.getName());
    @Value("${google.client-id}")
    private String CLIENT_ID;

    public GoogleIdToken.Payload verifyToken(String idToken) throws Exception {
        if (idToken == null || idToken.trim().isEmpty()) {
            LOGGER.severe("Received null or empty ID token");
            throw new IllegalArgumentException("Google ID token is null or empty");
        }

        if (CLIENT_ID == null || CLIENT_ID.trim().isEmpty()) {
            LOGGER.severe("Google Client ID is not configured");
            throw new IllegalStateException("Google Client ID is not configured");
        }

        LOGGER.info("Verifying Google ID token (first 50 chars): " +
                (idToken.length() > 50 ? idToken.substring(0, 50) + "..." : idToken));
        LOGGER.info("Configured Client ID: " + CLIENT_ID);

        try {
            // Use default GsonFactory
            GsonFactory gsonFactory = GsonFactory.getDefaultInstance();

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), gsonFactory)
                    .setAudience(Collections.singletonList(CLIENT_ID))
                    .setIssuer("https://accounts.google.com")
                    .build();

            GoogleIdToken googleIdToken = verifier.verify(idToken);
            if (googleIdToken == null) {
                LOGGER.severe("Invalid Google ID token: Verification returned null");
                throw new IllegalArgumentException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = googleIdToken.getPayload();
            if (payload.getEmail() == null) {
                LOGGER.severe("No email found in token payload");
                throw new IllegalArgumentException("Email not found in token");
            }

            LOGGER.info("Token verified successfully. Email: " + payload.getEmail());
            LOGGER.info("Token audience: " + payload.getAudience());
            LOGGER.info("Token issuer: " + payload.getIssuer());
            return payload;
        } catch (IllegalArgumentException e) {
            LOGGER.severe("Token verification failed: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            LOGGER.severe("Unexpected error during token verification: " + e.getMessage());
            throw new Exception("Failed to verify Google token: " + e.getMessage(), e);
        }
    }
}