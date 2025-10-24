// models/PackageEntity.java
package com.example.ttms.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "PACKAGE")
public class PackageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer packageID;

    @Column(name = "Title")
    private String title;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Image")
    private String image;

    @Column(name = "Price")
    private BigDecimal price;

    @Column(name = "Status")
    private String status;

    @Column(name = "Offer")
    private BigDecimal offer;

    public Integer getPackageID() { return packageID; }
    public void setPackageID(Integer packageID) { this.packageID = packageID; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getOffer() { return offer; }
    public void setOffer(BigDecimal offer) { this.offer = offer; }
}