package com.backend.controller;

import com.backend.dto.LoginRequestDTO;
import com.backend.dto.CustomerRegistrationDTO;
import com.backend.entity.Admin;
import com.backend.entity.Client;
import com.backend.repository.AdminRepository;
import com.backend.repository.ClientRepository;
import com.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AdminRepository adminRepository;
    private final ClientRepository clientRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/admin/login")
    public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody LoginRequestDTO request) {
        Optional<Admin> adminOpt = adminRepository.findByEmail(request.getEmail());
        if (adminOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), adminOpt.get().getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        Admin admin = adminOpt.get();
        String token = jwtService.generateToken(admin.getEmail(), admin.getRole());
        
        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of(
                "id", admin.getAdminID(),
                "email", admin.getEmail(),
                "firstName", admin.getFName(),
                "lastName", admin.getLName(),
                "role", admin.getRole()
            )
        ));
    }

    @PostMapping("/customer/login")
    public ResponseEntity<Map<String, Object>> customerLogin(@RequestBody LoginRequestDTO request) {
        Optional<Client> clientOpt = clientRepository.findByEmail(request.getEmail());
        if (clientOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), clientOpt.get().getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        Client client = clientOpt.get();
        String token = jwtService.generateToken(client.getEmail(), "CUSTOMER");
        
        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of(
                "id", client.getUserID(),
                "email", client.getEmail(),
                "firstName", client.getFirstName(),
                "lastName", client.getLastName(),
                "role", "CUSTOMER"
            )
        ));
    }

    @PostMapping("/customer/register")
    public ResponseEntity<Map<String, Object>> customerRegister(@RequestBody CustomerRegistrationDTO request) {
        // Check if email already exists
        if (clientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        // Check if NIC already exists
        if (clientRepository.findByNic(request.getNic()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "NIC already registered");
        }

        Client client = new Client();
        client.setEmail(request.getEmail());
        client.setFirstName(request.getFirstName());
        client.setLastName(request.getLastName());
        client.setPhone(request.getPhone());
        client.setNic(request.getNic());
        client.setGender(request.getGender());
        client.setPassword(passwordEncoder.encode(request.getPassword()));
        client.setCreatedAt(LocalDateTime.now());
        
        client = clientRepository.save(client);
        
        String token = jwtService.generateToken(client.getEmail(), "CUSTOMER");
        
        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of(
                "id", client.getUserID(),
                "email", client.getEmail(),
                "firstName", client.getFirstName(),
                "lastName", client.getLastName(),
                "role", "CUSTOMER"
            )
        ));
    }
}
