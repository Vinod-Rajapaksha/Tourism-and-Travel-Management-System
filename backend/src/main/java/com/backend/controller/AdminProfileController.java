package com.backend.controller;

import com.backend.dto.AdminProfileDto;
import com.backend.dto.AdminUpdateDto;
import com.backend.entity.Admin;
import com.backend.repository.AdminRepository;
import com.backend.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class xccAdminProfileController {

    private final AdminRepository adminRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<AdminProfileDto> getProfile(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        String email = jwtService.validateToken(token).getSubject();

        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Admin admin = adminOpt.get();
        AdminProfileDto dto = new AdminProfileDto(
                admin.getAdminID(),
                admin.getFName(),
                admin.getLName(),
                admin.getRole(),
                admin.getEmail(),
                admin.getPhone(),
                admin.getCreatedAt());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(HttpServletRequest request,
            @Valid @RequestBody AdminUpdateDto updateDto) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        String email = jwtService.validateToken(token).getSubject();

        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Admin admin = adminOpt.get();
        admin.setFName(updateDto.getFName());
        admin.setLName(updateDto.getLName());
        admin.setPhone(updateDto.getPhone());
        admin.setEmail(updateDto.getEmail());
        admin.setPassword(passwordEncoder.encode(updateDto.getPassword()));
        adminRepository.save(admin);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteProfile(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        String email = jwtService.validateToken(token).getSubject();

        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isEmpty())
            return ResponseEntity.notFound().build();

        adminRepository.delete(adminOpt.get());
        return ResponseEntity.ok().build();
    }
}
