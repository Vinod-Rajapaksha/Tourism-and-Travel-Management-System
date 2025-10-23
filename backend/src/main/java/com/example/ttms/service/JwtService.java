package com.example.ttms.service;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import java.util.Date;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")

    private String jwtSecret;
    @PostConstruct
    public void init() {
        System.out.println(">>> JWT Secret Loaded: " + jwtSecret);
    }

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setId(java.util.UUID.randomUUID().toString())
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    public Claims validateToken(String token) {
        try {
            return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
        } catch (Exception e){
            System.out.println("❌ Token decoding failed. Token = " + token);
            e.printStackTrace();
            throw e;
        }
    }
}
