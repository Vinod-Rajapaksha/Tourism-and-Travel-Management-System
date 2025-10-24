// security/JwtTokenProvider.java
package com.example.ttms.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Component
public class JwtTokenProvider {
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long validityMs = 1000L * 60 * 60 * 8;

    public String createToken(String email, String role, Integer id) {
        Date now = new Date();
        String idKey = role.equals("ROLE_TOUR_GUIDE") ? "guideId" : "customerId";
        return Jwts.builder()
                .setSubject(email)
                .addClaims(Map.of("role", role, idKey, id))
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + validityMs))
                .signWith(key)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }
}