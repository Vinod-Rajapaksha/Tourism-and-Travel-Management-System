package com.backend.entity;

import com.backend.entity.enums.ReservationStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Reservation", indexes = {
        @Index(name = "IX_Reservation_User", columnList = "userID"),
        @Index(name = "IX_Reservation_Package", columnList = "packageID"),
        @Index(name = "IX_Reservation_Status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationID;

    @Column(name = "confirmationNumber", unique = true)
    private String confirmationNumber;

    @ManyToOne(optional = false)
    @JoinColumn(name = "userID")
    private Client client;

    @ManyToOne(optional = false)
    @JoinColumn(name = "packageID")
    private Packages Packages;

    @ManyToOne
    @JoinColumn(name = "guideID")
    private Guide guide;

    @OneToOne
    @JoinColumn(name = "paymentID")
    @JsonIgnore
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
