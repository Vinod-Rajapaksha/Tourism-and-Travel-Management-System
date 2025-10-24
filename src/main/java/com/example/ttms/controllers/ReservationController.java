// controllers/ReservationController.java
package com.example.ttms.controllers;

import com.example.ttms.dto.ReservationDTO;
import com.example.ttms.security.AuthUtils;
import com.example.ttms.services.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReservationController {
    private final ReservationService reservationService;
    private final AuthUtils auth;

    public ReservationController(ReservationService reservationService, AuthUtils auth) {
        this.reservationService = reservationService;
        this.auth = auth;
    }

    @GetMapping("/guides/{guideId}/reservations")
    @PreAuthorize("hasRole('TOUR_GUIDE')")
    public ResponseEntity<List<ReservationDTO>> getAssigned(
            @PathVariable Integer guideId,
            @RequestParam(required = false) List<String> status) {
        auth.assertGuideSelf(guideId);
        return ResponseEntity.ok(reservationService.getAssigned(guideId, status));
    }

    @PutMapping("/reservations/{reservationId}/complete")
    @PreAuthorize("hasRole('TOUR_GUIDE')")
    public ResponseEntity<?> markCompleted(@PathVariable Integer reservationId) {
        reservationService.markComplete(reservationId, auth.currentGuideId());
        return ResponseEntity.ok(Map.of("message", "Reservation completed"));
    }
}