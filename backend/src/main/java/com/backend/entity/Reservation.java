package com.backend.entity;

import com.backend.entity.enums.ReservationStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@ToString(exclude = { "client", "packages", "guide", "payment" })
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "Reservation", indexes = {
        @Index(name = "IX_Reservation_User", columnList = "userID"),
        @Index(name = "IX_Reservation_Package", columnList = "packageID"),
        @Index(name = "IX_Reservation_Status", columnList = "status")
})
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationID;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "userID")
    private Client client;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "packageID")
    private Packages packages;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guideID")
    private Guide guide;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paymentID")
    private Payment payment;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ReservationStatus status;

    @Column(name = "startDate")
    private LocalDate startDate;

    @Column(name = "endDate")
    private LocalDate endDate;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;
}
