package com.backend.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    private Long packageId;
    private String customerEmail;
    private BigDecimal amount;
    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER
    private String cardNumber;
    private String cardHolderName;
    private String expiryMonth;
    private String expiryYear;
    private String cvv;
}
