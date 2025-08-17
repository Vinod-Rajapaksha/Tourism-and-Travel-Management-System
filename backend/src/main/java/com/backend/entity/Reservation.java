package com.backend.entity;

import com.backend.entity.enums.ReservationStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Reservation", indexes = {
        @Index(name = "IX_Reservation_User", columnList = "userID"),
        @Index(name = "IX_Reservation_Package", columnList = "packageID"),
        @Index(name = "IX_Reservation_Status", columnList = "status")
})
public class Reservation {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "userID", nullable = false)
    private Client client;

    @ManyToOne(optional = false)
    @JoinColumn(name = "packageID", nullable = false)
    private Package tourPackage;

    @ManyToOne
    @JoinColumn(name = "guideID")
    private Guide guide;

    @OneToOne
    @JoinColumn(name = "paymentID")
    private Payment payment; // nullable; DB has ON DELETE SET NULL

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 16, nullable = false)
    private ReservationStatus status;

    @Column(name = "startDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "endDate", nullable = false)
    private LocalDate endDate;

    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

}
