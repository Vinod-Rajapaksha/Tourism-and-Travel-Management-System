package com.backend.controller;

import com.backend.dto.Analyse.PaymentDTO;
import com.backend.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Create a new payment
    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(@Valid @RequestBody PaymentDTO paymentDTO) {
        try {
            PaymentDTO createdPayment = paymentService.createPayment(paymentDTO);
            return new ResponseEntity<>(createdPayment, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Process payment
    @PostMapping("/process")
    public ResponseEntity<PaymentDTO> processPayment(@Valid @RequestBody PaymentDTO paymentDTO) {
        try {
            PaymentDTO processedPayment = paymentService.processPayment(paymentDTO);
            return new ResponseEntity<>(processedPayment, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all payments
    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        List<PaymentDTO> payments = paymentService.getAllPayments();
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    // Get payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable Long id) {
        Optional<PaymentDTO> payment = paymentService.getPaymentById(id);
        return payment.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get payments by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByStatus(@PathVariable String status) {
        List<PaymentDTO> payments = paymentService.getPaymentsByStatus(status);
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    // Get confirmed payments
    @GetMapping("/confirmed")
    public ResponseEntity<List<PaymentDTO>> getConfirmedPayments() {
        List<PaymentDTO> payments = paymentService.getConfirmedPayments();
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    // Get payments by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByUserId(@PathVariable Long userId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByUserId(userId);
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    // Get payments by package ID
    @GetMapping("/package/{packageId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByPackageId(@PathVariable Long packageId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByPackageId(packageId);
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    // Get payments in date range
    @GetMapping("/date-range")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<PaymentDTO> payments = paymentService.getPaymentsByDateRange(startDate, endDate);
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    // Update payment
    @PutMapping("/{id}")
    public ResponseEntity<PaymentDTO> updatePayment(@PathVariable Long id, @Valid @RequestBody PaymentDTO paymentDTO) {
        Optional<PaymentDTO> updatedPayment = paymentService.updatePayment(id, paymentDTO);
        return updatedPayment.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Delete payment
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletePayment(@PathVariable Long id) {
        boolean deleted = paymentService.deletePayment(id);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Reports
    @GetMapping("/reports/total-amount")
    public ResponseEntity<BigDecimal> getTotalConfirmedAmount() {
        BigDecimal totalAmount = paymentService.getTotalConfirmedAmount();
        return new ResponseEntity<>(totalAmount, HttpStatus.OK);
    }

    @GetMapping("/reports/total-count")
    public ResponseEntity<Long> getTotalConfirmedCount() {
        long totalCount = paymentService.getTotalConfirmedCount();
        return new ResponseEntity<>(totalCount, HttpStatus.OK);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<PaymentDTO>> getRecentPayments() {
        List<PaymentDTO> payments = paymentService.getRecentPayments();
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    @PostMapping("/cleanup-expired")
    public ResponseEntity<Map<String, Object>> cleanupExpiredPendingPayments(
            @RequestParam(defaultValue = "30") int minutesOld) {
        int cleanedCount = paymentService.cleanupExpiredPendingPayments(minutesOld);
        return new ResponseEntity<>(Map.of(
                "message", "Cleanup completed successfully",
                "cleanedPayments", cleanedCount), HttpStatus.OK);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return new ResponseEntity<>(Map.of(
                "status", "UP",
                "service", "Payment Service",
                "timestamp", LocalDateTime.now().toString()), HttpStatus.OK);
    }
}
