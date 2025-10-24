package com.backend.designpatterns;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class CashPayment implements com.backend.service.PaymentService.PaymentStrategy {

    @Override
    public boolean processPayment(BigDecimal amount) {
        System.out.println("Processing cash payment of LKR " + amount);
        // Cash payment always succeeds
        return true;
    }

    @Override
    public String getStrategyName() {
        return "CASH";
    }
}