package com.backend.designpatterns;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public abstract class PayPalPayment implements com.backend.service.PaymentService.PaymentStrategy {
    @Override
    public boolean processPayment(BigDecimal amount) {
        System.out.println("Processing PayPal payment of LKR " + amount);
        // Actual PayPal logic would go here
        return Math.random() < 0.90; // 90% success rate for example
    }

    @Override
    public String getStrategyName() {
        return "PAYPAL";
    }
}