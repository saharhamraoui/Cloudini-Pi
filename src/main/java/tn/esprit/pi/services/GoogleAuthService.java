package tn.esprit.pi.services;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Date;

@Service
public class GoogleAuthService {
    private static final Logger logger = LoggerFactory.getLogger(GoogleAuthService.class);

    @Value("${google.client-id}")
    private String clientId;

    public GoogleIdToken.Payload verifyToken(String idTokenString) throws GeneralSecurityException, IOException {
        try {
            // Initialize verifier with HTTP transport and JSON factory
            NetHttpTransport transport = new NetHttpTransport();
            GsonFactory jsonFactory = new GsonFactory();

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            // Verify the ID token
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                logger.error("Invalid ID token: verification returned null");
                throw new GeneralSecurityException("Invalid ID token");
            }

            // Additional validation
            GoogleIdToken.Payload payload = idToken.getPayload();
            if (!payload.getAudience().equals(clientId)) {
                logger.error("Audience mismatch");
                throw new GeneralSecurityException("Audience mismatch");
            }

            if (new Date().after(new Date(payload.getExpirationTimeSeconds() * 1000))) {
                logger.error("Token expired");
                throw new GeneralSecurityException("Token expired");
            }

            return payload;
        } catch (IllegalArgumentException e) {
            logger.error("Malformed token", e);
            throw new GeneralSecurityException("Malformed token");
        }
    }
}