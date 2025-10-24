// controllers/FeedbackController.java
package com.example.ttms.controllers;

import com.example.ttms.dto.FeedbackDTO;
import com.example.ttms.security.AuthUtils;
import com.example.ttms.services.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FeedbackController {
    private final FeedbackService feedbackService;
    private final AuthUtils auth;

    public FeedbackController(FeedbackService feedbackService, AuthUtils auth) {
        this.feedbackService = feedbackService;
        this.auth = auth;
    }

    @GetMapping("/guides/{guideId}/feedback")
    @PreAuthorize("hasRole('TOUR_GUIDE')")
    public ResponseEntity<List<FeedbackDTO>> feedbackForGuide(@PathVariable Integer guideId) {
        auth.assertGuideSelf(guideId);
        List<FeedbackDTO> list = feedbackService.getAllForGuide(guideId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/reservations/{reservationId}/feedback")
    @PreAuthorize("hasRole('TOUR_GUIDE')")
    public ResponseEntity<?> feedbackForReservation(@PathVariable Integer reservationId) {
        FeedbackDTO dto = feedbackService.getForReservation(reservationId, auth.currentGuideId());
        if (dto == null) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(dto);
    }
}
