package com.backend.designpatterns;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class BankTransferPayment implements com.backend.service.PaymentService.PaymentStrategy {

    @Override
    public boolean processPayment(BigDecimal amount) {
        System.out.println("Processing bank transfer of LKR " + amount);
        // Simulate bank transfer processing with 95% success rate
        boolean success = Math.random() < 0.95;
        return success;
    }

    @Override
    public String getStrategyName() {
        return "BANK_TRANSFER";
    }
}