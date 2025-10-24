package com.backend.designpatterns;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class CreditCardPayment implements com.backend.service.PaymentService.PaymentStrategy {

    @Override
    public boolean processPayment(BigDecimal amount) {
        System.out.println("Processing credit card payment of LKR " + amount);
        // Simulate credit card processing with 85% success rate
        boolean success = Math.random() < 0.85;
        return success;
    }

    @Override
    public String getStrategyName() {
        return "CREDIT_CARD";
    }
}