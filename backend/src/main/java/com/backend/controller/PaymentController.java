package com.backend.controller;

import com.backend.dto.PaymentRequestDTO;
import com.backend.entity.Payment;
import com.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customer/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody PaymentRequestDTO request) {
        Payment payment = paymentService.processPayment(request);
        
        return ResponseEntity.ok(Map.of(
            "paymentId", payment.getPaymentID(),
            "status", payment.getStatus().toString(),
            "amount", payment.getAmount(),
            "paymentDate", payment.getPaymentDate(),
            "success", payment.getStatus().toString().equals("SUCCESS")
        ));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long paymentId) {
        Payment payment = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/{paymentId}/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@PathVariable Long paymentId) {
        boolean verified = paymentService.verifyPayment(paymentId);
        return ResponseEntity.ok(Map.of("paymentId", paymentId, "verified", verified));
    }
}
