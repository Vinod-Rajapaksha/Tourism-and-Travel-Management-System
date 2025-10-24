// dto/ReservationDTO.java
package com.example.ttms.dto;

import java.time.LocalDate;

public class ReservationDTO {
    private Integer reservationID;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private PackageSummaryDTO pack;
    private ClientSummaryDTO client;

    public Integer getReservationID() { return reservationID; }
    public void setReservationID(Integer reservationID) { this.reservationID = reservationID; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public PackageSummaryDTO getPack() { return pack; }
    public void setPack(PackageSummaryDTO pack) { this.pack = pack; }

    public ClientSummaryDTO getClient() { return client; }
    public void setClient(ClientSummaryDTO client) { this.client = client; }

    public static class PackageSummaryDTO {
        private Integer packageID;
        private String title;
        private String image;
        private String status;

        public Integer getPackageID() { return packageID; }
        public void setPackageID(Integer packageID) { this.packageID = packageID; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class ClientSummaryDTO {
        private Integer userID;
        private String fName;
        private String lName;
        private String email;

        public Integer getUserID() { return userID; }
        public void setUserID(Integer userID) { this.userID = userID; }

        public String getFName() { return fName; }
        public void setFName(String fName) { this.fName = fName; }

        public String getLName() { return lName; }
        public void setLName(String lName) { this.lName = lName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}