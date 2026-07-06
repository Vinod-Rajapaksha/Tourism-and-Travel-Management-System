package com.backend.controller;

import com.backend.dto.adminProfile.LoginRequestDTO;
import com.backend.dto.auth.GuideRegisterDTO;
import com.backend.dto.client.ClientCreateDTO;
import com.backend.entity.Admin;
import com.backend.entity.Client;
import com.backend.entity.Guide;
import com.backend.entity.enums.GuideStatus;
import com.backend.repository.AdminRepository;
import com.backend.repository.ClientRepository;
import com.backend.repository.GuideRepository;
import com.backend.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AdminRepository adminRepo;
    private final ClientRepository clientRepo;
    private final GuideRepository guideRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequestDTO login) {
        Admin admin = adminRepo.findByEmail(login.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email"));

        if (!passwordEncoder.matches(login.getPassword(), admin.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        String token = jwtService.generateToken(admin.getEmail(), admin.getRole());
        return ResponseEntity.ok(Map.of("token", token, "email", admin.getEmail(), "role", admin.getRole()));
    }

    @PostMapping("/tourist/register")
    public ResponseEntity<?> registerTourist(@Valid @RequestBody ClientCreateDTO dto) {
        if (clientRepo.existsByEmail(dto.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email is already registered. Please login.", "field", "email"));
        }
        if (clientRepo.existsByNic(dto.nic())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "NIC is already registered.", "field", "nic"));
        }

        Client client = new Client();
        client.setFirstName(dto.firstName());
        client.setLastName(dto.lastName());
        client.setGender(dto.gender());
        client.setNic(dto.nic());
        client.setEmail(dto.email());
        client.setPassword(passwordEncoder.encode(dto.password()));
        client.setPhone(dto.phone());
        client.setCreatedAt(LocalDateTime.now());

        Client saved = clientRepo.save(client);
        String token = jwtService.generateToken(saved.getEmail(), "TOURIST");

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "token", token,
                "email", saved.getEmail(),
                "role", "TOURIST",
                "userID", saved.getUserID(),
                "firstName", saved.getFirstName(),
                "lastName", saved.getLastName(),
                "message", "Tourist account created successfully!"));
    }

    @PostMapping("/tourist/login")
    public ResponseEntity<?> loginTourist(@RequestBody LoginRequestDTO login) {
        Client client = clientRepo.findByEmail(login.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "No tourist account found with this email."));

        if (!passwordEncoder.matches(login.getPassword(), client.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect password.");
        }

        String token = jwtService.generateToken(client.getEmail(), "TOURIST");
        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", client.getEmail(),
                "role", "TOURIST",
                "userID", client.getUserID(),
                "firstName", client.getFirstName(),
                "lastName", client.getLastName()));
    }

    @PostMapping("/guide/register")
    public ResponseEntity<?> registerGuide(@Valid @RequestBody GuideRegisterDTO dto) {
        if (guideRepo.existsByEmailIgnoreCase(dto.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email is already registered as a guide.", "field", "email"));
        }
        if (guideRepo.existsByNic(dto.nic())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "NIC is already associated with an existing guide.", "field", "nic"));
        }

        Guide guide = new Guide();
        guide.setFirstName(dto.firstName());
        guide.setLastName(dto.lastName());
        guide.setGender(dto.gender());
        guide.setNic(dto.nic());
        guide.setEmail(dto.email());
        guide.setPassword(passwordEncoder.encode(dto.password()));
        guide.setPhone(dto.phone());
        guide.setStatus(GuideStatus.PENDING);
        guide.setCreatedAt(LocalDateTime.now());

        Guide saved = guideRepo.save(guide);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", "PENDING",
                "message",
                "Your guide application has been submitted successfully and is currently waiting for approval by the system administrator.",
                "email", saved.getEmail(),
                "firstName", saved.getFirstName(),
                "lastName", saved.getLastName()));
    }

    @PostMapping("/guide/login")
    public ResponseEntity<?> loginGuide(@RequestBody LoginRequestDTO login) {
        Guide guide = guideRepo.findByEmailIgnoreCase(login.getEmail())
                .or(() -> guideRepo.findByEmail(login.getEmail()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "No tour guide account found with this email."));

        if (!passwordEncoder.matches(login.getPassword(), guide.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect password.");
        }

        if (guide.getStatus() == GuideStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "status", "PENDING",
                    "message", "Your registration is currently pending review and approval by the General Manager.",
                    "email", guide.getEmail(),
                    "firstName", guide.getFirstName(),
                    "lastName", guide.getLastName()));
        }

        if (guide.getStatus() == GuideStatus.INACTIVE) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "status", "INACTIVE",
                    "message",
                    "Your tour guide account has been suspended or deactivated. Please contact customer service."));
        }

        String token = jwtService.generateToken(guide.getEmail(), "GUIDE");
        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", guide.getEmail(),
                "role", "GUIDE",
                "guideID", guide.getGuideID(),
                "firstName", guide.getFirstName(),
                "lastName", guide.getLastName()));
    }

    @GetMapping("/guide/status")
    public ResponseEntity<?> getGuideStatus(@RequestParam String email) {
        Guide guide = guideRepo.findByEmailIgnoreCase(email)
                .or(() -> guideRepo.findByEmail(email))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guide not found"));

        return ResponseEntity.ok(Map.of(
                "status", guide.getStatus().name(),
                "email", guide.getEmail(),
                "firstName", guide.getFirstName(),
                "lastName", guide.getLastName()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }

        String email = authentication.getName();
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(r -> r.startsWith("ROLE_") ? r.substring(5) : r)
                .toList();

        return ResponseEntity.ok(Map.of(
                "email", email,
                "roles", roles,
                "fName", authentication.getName()));
    }
}
