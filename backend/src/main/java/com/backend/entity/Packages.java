package com.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.PrePersist;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Packages")
public class Packages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "packageID")
    private Long packageID;

    @Column(name = "image")
    private String image;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price",  precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "offer", precision = 10, scale = 2)
    private BigDecimal offer;

    @Column(name = "status", nullable = false)
    private String status = "ACTIVE";

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    // Default constructor
    public Packages() {}

    // Constructor
    public Packages(String image, String title, String description, BigDecimal price, BigDecimal offer, String status) {
        this.image = image;
        this.title = title;
        this.description = description;
        this.price = price;
        this.offer = offer;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getPackageID() {
        return packageID;
    }

    public void setPackageID(Long packageID) {
        this.packageID = packageID;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getOffer() {
        return offer;
    }

    public void setOffer(BigDecimal offer) {
        this.offer = offer;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // PrePersist to set createdAt automatically
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Packages{" +
                "packageID=" + packageID +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", offer=" + offer +
                ", status='" + status + '\'' +
                ", image='" + image + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}