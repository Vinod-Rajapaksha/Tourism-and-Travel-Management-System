package com.backend.dto.Analyse;

import com.backend.entity.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Email;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDTO {

    private Long paymentId;

    private String bookingId;

    private Long reservationId;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String currency = "LKR";

    private LocalDateTime paymentDate;

    private PaymentStatus status;

    private String method;

    @NotNull(message = "Package ID is required")
    private Long packageId;

    private String packageName;

    private BigDecimal packagePrice;

    @Email(message = "Invalid email format")
    private String customerEmail;

    private String customerPhone;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Constructors
    public PaymentDTO() {
    }

    public PaymentDTO(Long userId, BigDecimal amount, PaymentStatus status, Long packageId) {
        this.userId = userId;
        this.amount = amount;
        this.status = status;
        this.packageId = packageId;
        this.paymentDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    public PaymentDTO(Long userId, BigDecimal amount, PaymentStatus status,
            Long packageId, String packageName, BigDecimal packagePrice) {
        this.userId = userId;
        this.amount = amount;
        this.status = status;
        this.packageId = packageId;
        this.packageName = packageName;
        this.packagePrice = packagePrice;
        this.paymentDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    // Additional constructor for full DTO
    public PaymentDTO(String bookingId, Long userId, BigDecimal amount, String currency,
            PaymentStatus status, String method, Long packageId, String packageName,
            BigDecimal packagePrice, String customerEmail, String customerPhone) {
        this.bookingId = bookingId;
        this.userId = userId;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.method = method;
        this.packageId = packageId;
        this.packageName = packageName;
        this.packagePrice = packagePrice;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.paymentDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public Long getPackageId() { // FIXED: Correct method signature
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public BigDecimal getPackagePrice() {
        return packagePrice;
    }

    public void setPackagePrice(BigDecimal packagePrice) {
        this.packagePrice = packagePrice;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "PaymentDTO{" +
                "paymentId=" + paymentId +
                ", bookingId='" + bookingId + '\'' +
                ", userId=" + userId +
                ", amount=" + amount +
                ", currency='" + currency + '\'' +
                ", paymentDate=" + paymentDate +
                ", status=" + status +
                ", method='" + method + '\'' +
                ", packageId=" + packageId +
                ", packageName='" + packageName + '\'' +
                ", packagePrice=" + packagePrice +
                ", customerEmail='" + customerEmail + '\'' +
                ", customerPhone='" + customerPhone + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }
}