package com.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookingRequestDTO {
    @NotNull
    private Long packageId;

    @NotBlank @Email
    private String email;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String phone;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @NotNull @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal amount;

    // Payment information
    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER
    private String cardNumber;
    private String cardHolderName;
    private String expiryMonth;
    private String expiryYear;
    private String cvv;
}


