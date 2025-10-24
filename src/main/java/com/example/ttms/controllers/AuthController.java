// controllers/AuthController.java
package com.example.ttms.controllers;

import com.example.ttms.dto.AuthResponse;
import com.example.ttms.models.Guide;
import com.example.ttms.models.Client;
import com.example.ttms.repositories.GuideRepository;
import com.example.ttms.repositories.ClientRepository;
import com.example.ttms.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final GuideRepository guideRepo;
    private final ClientRepository clientRepo;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider jwt;

    public AuthController(GuideRepository guideRepo, ClientRepository clientRepo, PasswordEncoder encoder, JwtTokenProvider jwt) {
        this.guideRepo = guideRepo;
        this.clientRepo = clientRepo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        // Try guide login first
        try {
            Guide g = guideRepo.findByEmail(req.email)
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));

            if (!encoder.matches(req.password, g.getPassword())) {
                throw new RuntimeException("Invalid credentials");
            }

            String token = jwt.createToken(g.getEmail(), "ROLE_TOUR_GUIDE", g.getGuideID());

            AuthResponse resp = new AuthResponse();
            resp.setToken(token);
            resp.setRole("ROLE_TOUR_GUIDE");
            resp.setGuideId(g.getGuideID());
            resp.setEmail(g.getEmail());

            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            // Try customer login
            try {
                Client c = clientRepo.findByEmail(req.email)
                        .orElseThrow(() -> new RuntimeException("Invalid credentials"));

                if (!encoder.matches(req.password, c.getPassword())) {
                    throw new RuntimeException("Invalid credentials");
                }

                String token = jwt.createToken(c.getEmail(), "ROLE_CUSTOMER", c.getUserID());

                AuthResponse resp = new AuthResponse();
                resp.setToken(token);
                resp.setRole("ROLE_CUSTOMER");
                resp.setCustomerId(c.getUserID());
                resp.setEmail(c.getEmail());

                return ResponseEntity.ok(resp);
            } catch (RuntimeException ex) {
                throw new RuntimeException("Invalid credentials");
            }
        }
    }

    public record LoginRequest(String email, String password) {}
}