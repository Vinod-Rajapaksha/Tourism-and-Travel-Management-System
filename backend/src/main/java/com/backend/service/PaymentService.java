package com.backend.service;

import com.backend.dto.PaymentRequestDTO;
import com.backend.entity.Payment;

public interface PaymentService {
    Payment processPayment(PaymentRequestDTO request);
    Payment getPaymentById(Long paymentId);
    boolean verifyPayment(Long paymentId);
}
