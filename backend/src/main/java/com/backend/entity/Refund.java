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
    @JoinColumn(name = "paymentID")
    private Payment payment;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "reason")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RefundStatus status;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

}
