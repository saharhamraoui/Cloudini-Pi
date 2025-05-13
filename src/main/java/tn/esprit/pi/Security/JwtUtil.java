package tn.esprit.pi.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 heures
                .signWith(key) // Utiliser la clé sécurisée
                .compact();

    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key) // Utiliser la même clé pour la vérification
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}