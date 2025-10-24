package com.backend.entity;

import com.backend.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Payment", indexes = {
        @Index(name = "IX_Payment_User", columnList = "userID"),
        @Index(name = "IX_Payment_Status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "userID")
    private Client client;

    @ManyToOne(optional = false)
    @JoinColumn(name = "packageID")
    private Packages Packages;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "paymentDate")
    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus status;

    @OneToOne(mappedBy = "payment")
    @JsonIgnore
    private Reservation reservation;

    @OneToOne(mappedBy = "payment")
    @JsonIgnore
    private Refund refund;

}
