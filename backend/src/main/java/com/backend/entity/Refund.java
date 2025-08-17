package com.backend.entity;

import com.backend.entity.enums.RefundStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Refund")
public class Refund {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long refundID;

    @OneToOne(optional = false)
    @JoinColumn(name = "paymentID", nullable = false)
    private Payment payment;

    @Column(name = "amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "reason", length = 255)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 16, nullable = false)
    private RefundStatus status;

    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

}
