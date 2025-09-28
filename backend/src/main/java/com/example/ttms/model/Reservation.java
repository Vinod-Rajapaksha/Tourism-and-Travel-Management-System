package com.example.ttms.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "Reservation")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationID;

    private Long userID;
    private Long packageID;
    private Long guideID;
    private Long paymentID;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;

    // getters and setters
    public Long getReservationID() { return reservationID; }
    public void setReservationID(Long reservationID) { this.reservationID = reservationID; }

    public Long getUserID() { return userID; }
    public void setUserID(Long userID) { this.userID = userID; }

    public Long getPackageID() { return packageID; }
    public void setPackageID(Long packageID) { this.packageID = packageID; }

    public Long getGuideID() { return guideID; }
    public void setGuideID(Long guideID) { this.guideID = guideID; }

    public Long getPaymentID() { return paymentID; }
    public void setPaymentID(Long paymentID) { this.paymentID = paymentID; }

    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

