package com.backend.dto;

import com.backend.entity.enums.PaymentMethod;
import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class UpdatePaymentProfileDto {
    
    @Size(max = 100, message = "Profile name must not exceed 100 characters")
    private String profileName;

    private PaymentMethod paymentMethod;

    @Pattern(regexp = "^[0-9\\s-]{13,19}$", message = "Invalid card number format")
    private String cardNumber;

    @Size(max = 100, message = "Card holder name must not exceed 100 characters")
    private String cardHolderName;

    @Pattern(regexp = "^(0[1-9]|1[0-2])$", message = "Invalid expiry month format (MM)")
    private String expiryMonth;

    @Pattern(regexp = "^[0-9]{4}$", message = "Invalid expiry year format (YYYY)")
    private String expiryYear;

    @Size(max = 255, message = "Billing address must not exceed 255 characters")
    private String billingAddress;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    private String postalCode;

    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    private Boolean isDefault;
    private Boolean isActive;
}
