package com.backend.dto;

import com.backend.entity.enums.PaymentMethod;
import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class CreatePaymentProfileDto {
    
    @NotBlank(message = "Profile name is required")
    @Size(max = 100, message = "Profile name must not exceed 100 characters")
    private String profileName;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @NotBlank(message = "Card number is required")
    @Pattern(regexp = "^[0-9\\s-]{13,19}$", message = "Invalid card number format")
    private String cardNumber;

    @NotBlank(message = "Card holder name is required")
    @Size(max = 100, message = "Card holder name must not exceed 100 characters")
    private String cardHolderName;

    @NotBlank(message = "Expiry month is required")
    @Pattern(regexp = "^(0[1-9]|1[0-2])$", message = "Invalid expiry month format (MM)")
    private String expiryMonth;

    @NotBlank(message = "Expiry year is required")
    @Pattern(regexp = "^[0-9]{4}$", message = "Invalid expiry year format (YYYY)")
    private String expiryYear;

    @NotBlank(message = "Billing address is required")
    @Size(max = 255, message = "Billing address must not exceed 255 characters")
    private String billingAddress;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @NotBlank(message = "Postal code is required")
    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    private String postalCode;

    @NotBlank(message = "Country is required")
    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    private Boolean isDefault = false;
}
