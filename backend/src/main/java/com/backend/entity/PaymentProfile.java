package com.backend.entity;

import com.backend.entity.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "PaymentProfile", indexes = {
        @Index(name = "IX_PaymentProfile_Client", columnList = "clientID"),
        @Index(name = "IX_PaymentProfile_IsDefault", columnList = "isDefault")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "clientID")
    private Client client;

    @Column(name = "profileName")
    private String profileName;

    @Enumerated(EnumType.STRING)
    @Column(name = "paymentMethod")
    private PaymentMethod paymentMethod;

    @Column(name = "cardNumber", length = 19)
    private String cardNumber; // Masked card number

    @Column(name = "cardHolderName")
    private String cardHolderName;

    @Column(name = "expiryMonth")
    private String expiryMonth;

    @Column(name = "expiryYear")
    private String expiryYear;

    @Column(name = "billingAddress")
    private String billingAddress;

    @Column(name = "city")
    private String city;

    @Column(name = "postalCode")
    private String postalCode;

    @Column(name = "country")
    private String country;

    @Column(name = "isDefault")
    private Boolean isDefault = false;

    @Column(name = "isActive")
    private Boolean isActive = true;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "paymentProfile")
    @JsonIgnore
    private List<Payment> payments;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
