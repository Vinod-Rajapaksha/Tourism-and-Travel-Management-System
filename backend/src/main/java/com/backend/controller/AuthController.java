package com.backend.controller;

import com.backend.dto.LoginRequest;
import com.backend.entity.Admin;
import com.backend.repository.AdminRepository;
import com.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AdminRepository adminRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/admin/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest login) {
        Admin admin = adminRepo.findByEmail(login.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email"));

        if (!passwordEncoder.matches(login.getPassword(), admin.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        String token = jwtService.generateToken(admin.getEmail(), admin.getRole());
        return ResponseEntity.ok(Map.of("token", token));
    }
}
