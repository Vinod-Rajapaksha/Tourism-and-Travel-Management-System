package com.example.ttms.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReservationDTO {
    private Long reservationID;
    private Long userID;
    private Long packageID;
    private Long guideID; // may be null
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // getters / setters
    public Long getReservationID() { return reservationID; }
    public void setReservationID(Long reservationID) { this.reservationID = reservationID; }

    public Long getUserID() { return userID; }
    public void setUserID(Long userID) { this.userID = userID; }

    public Long getPackageID() { return packageID; }
    public void setPackageID(Long packageID) { this.packageID = packageID; }

    public Long getGuideID() { return guideID; }
    public void setGuideID(Long guideID) { this.guideID = guideID; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

