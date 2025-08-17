package com.backend.entity;

import com.backend.entity.enums.PackageStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Packages", indexes = {
        @Index(name = "IX_Packages_Status", columnList = "status")
})
public class Package {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long packageID;

    @Column(name = "image", length = 300)
    private String image;

    @Column(name = "title", length = 150, nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "offer", precision = 5, scale = 2)
    private BigDecimal offer;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 16, nullable = false)
    private PackageStatus status;

    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "tourPackage")
    private List<Reservation> reservations;

    @OneToMany(mappedBy = "tourPackage")
    private List<Payment> payments;

    @OneToMany(mappedBy = "tourPackage")
    private List<Feedback> feedbacks;

}
