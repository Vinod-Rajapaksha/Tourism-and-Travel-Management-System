package com.backend.entity;

import com.backend.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Payment", indexes = {
        @Index(name = "IX_Payment_User", columnList = "userID"),
        @Index(name = "IX_Payment_Status", columnList = "status")
})
public class Payment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "userID", nullable = false)
    private Client client;

    @ManyToOne(optional = false)
    @JoinColumn(name = "packageID", nullable = false)
    private Package tourPackage;

    @Column(name = "amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "paymentDate", nullable = false)
    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 16, nullable = false)
    private PaymentStatus status;

    @OneToOne(mappedBy = "payment")
    private Reservation reservation;

    @OneToOne(mappedBy = "payment")
    private Refund refund;

}
