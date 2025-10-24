package com.backend.dto;

import com.backend.entity.enums.PaymentMethod;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentProfileDto {
    private Long profileID;
    private String profileName;
    private PaymentMethod paymentMethod;
    private String cardNumber; // Masked
    private String cardHolderName;
    private String expiryMonth;
    private String expiryYear;
    private String billingAddress;
    private String city;
    private String postalCode;
    private String country;
    private Boolean isDefault;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
