package com.backend.controller;

import com.backend.dto.CreatePaymentProfileDto;
import com.backend.dto.PaymentProfileDto;
import com.backend.dto.UpdatePaymentProfileDto;
import com.backend.service.JwtService;
import com.backend.service.PaymentProfileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class PaymentProfileController {

    private final PaymentProfileService paymentProfileService;
    private final JwtService jwtService;

    @GetMapping("/payment-profiles")
    public ResponseEntity<List<PaymentProfileDto>> getPaymentProfiles(HttpServletRequest request) {
        Long clientId = getClientIdFromToken(request);
        List<PaymentProfileDto> profiles = paymentProfileService.getPaymentProfiles(clientId);
        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/payment-profiles/{profileId}")
    public ResponseEntity<PaymentProfileDto> getPaymentProfile(
            HttpServletRequest request, 
            @PathVariable Long profileId) {
        Long clientId = getClientIdFromToken(request);
        PaymentProfileDto profile = paymentProfileService.getPaymentProfile(clientId, profileId);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/payment-profiles")
    public ResponseEntity<PaymentProfileDto> createPaymentProfile(
            HttpServletRequest request, 
            @Valid @RequestBody CreatePaymentProfileDto createRequest) {
        Long clientId = getClientIdFromToken(request);
        PaymentProfileDto profile = paymentProfileService.createPaymentProfile(clientId, createRequest);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/payment-profiles/{profileId}")
    public ResponseEntity<PaymentProfileDto> updatePaymentProfile(
            HttpServletRequest request, 
            @PathVariable Long profileId,
            @Valid @RequestBody UpdatePaymentProfileDto updateRequest) {
        Long clientId = getClientIdFromToken(request);
        PaymentProfileDto profile = paymentProfileService.updatePaymentProfile(clientId, profileId, updateRequest);
        return ResponseEntity.ok(profile);
    }

    @DeleteMapping("/payment-profiles/{profileId}")
    public ResponseEntity<Void> deletePaymentProfile(
            HttpServletRequest request, 
            @PathVariable Long profileId) {
        Long clientId = getClientIdFromToken(request);
        paymentProfileService.deletePaymentProfile(clientId, profileId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/payment-profiles/{profileId}/set-default")
    public ResponseEntity<PaymentProfileDto> setDefaultPaymentProfile(
            HttpServletRequest request, 
            @PathVariable Long profileId) {
        Long clientId = getClientIdFromToken(request);
        PaymentProfileDto profile = paymentProfileService.setDefaultPaymentProfile(clientId, profileId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/payment-profiles/default")
    public ResponseEntity<PaymentProfileDto> getDefaultPaymentProfile(HttpServletRequest request) {
        Long clientId = getClientIdFromToken(request);
        PaymentProfileDto profile = paymentProfileService.getDefaultPaymentProfile(clientId);
        return ResponseEntity.ok(profile);
    }

    private Long getClientIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization header");
        }

        String token = authHeader.substring(7);
        String email = jwtService.validateToken(token).getSubject();
        
        // You would need to get client ID from email
        // This is a simplified version - you might need to inject ClientRepository
        // or create a method in JwtService to get client ID
        return 1L; // Placeholder - implement proper client ID retrieval
    }
}
