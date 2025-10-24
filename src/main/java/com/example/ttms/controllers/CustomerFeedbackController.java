package com.example.ttms.controllers;

import com.example.ttms.dto.FeedbackDTO;
import com.example.ttms.security.AuthUtils;
import com.example.ttms.services.CustomerFeedbackService;
import com.example.ttms.services.CustomerFeedbackService.CreateFeedbackRequest;
import com.example.ttms.services.CustomerFeedbackService.UpdateFeedbackRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerFeedbackController {
    private final CustomerFeedbackService customerFeedbackService;
    private final AuthUtils auth;

    public CustomerFeedbackController(CustomerFeedbackService customerFeedbackService, AuthUtils auth) {
        this.customerFeedbackService = customerFeedbackService;
        this.auth = auth;
    }

    @GetMapping("/{customerId}/feedback")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<FeedbackDTO>> getCustomerFeedback(@PathVariable Integer customerId) {
        auth.assertCustomerSelf(customerId);
        List<FeedbackDTO> feedback = customerFeedbackService.getCustomerFeedback(customerId);
        return ResponseEntity.ok(feedback);
    }

    @PostMapping("/{customerId}/feedback")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<FeedbackDTO> createFeedback(
            @PathVariable Integer customerId,
            @RequestBody CreateFeedbackRequest request) {
        auth.assertCustomerSelf(customerId);
        FeedbackDTO feedback = customerFeedbackService.createFeedback(customerId, request);
        return ResponseEntity.ok(feedback);
    }

    @PutMapping("/{customerId}/feedback/{feedbackId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<FeedbackDTO> updateFeedback(
            @PathVariable Integer customerId,
            @PathVariable Integer feedbackId,
            @RequestBody UpdateFeedbackRequest request) {
        auth.assertCustomerSelf(customerId);
        FeedbackDTO feedback = customerFeedbackService.updateFeedback(customerId, feedbackId, request);
        return ResponseEntity.ok(feedback);
    }

    @DeleteMapping("/{customerId}/feedback/{feedbackId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Map<String, String>> deleteFeedback(
            @PathVariable Integer customerId,
            @PathVariable Integer feedbackId) {
        auth.assertCustomerSelf(customerId);
        customerFeedbackService.deleteFeedback(customerId, feedbackId);
        return ResponseEntity.ok(Map.of("message", "Feedback deleted successfully"));
    }

    @GetMapping("/{customerId}/completed-reservations")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Map<String, Object>>> getCompletedReservations(@PathVariable Integer customerId) {
        auth.assertCustomerSelf(customerId);
        List<Map<String, Object>> reservations = customerFeedbackService.getCompletedReservations(customerId);
        return ResponseEntity.ok(reservations);
    }
}