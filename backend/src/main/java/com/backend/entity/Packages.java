package com.backend.entity;

import com.backend.entity.enums.PackageStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Packages", indexes = {
        @Index(name = "IX_Packages_Status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Packages {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long packageID;

    @Column(name = "image")
    private String image;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "offer")
    private BigDecimal offer;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PackageStatus status;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "Packages")
    @JsonIgnore
    private List<Reservation> reservations;

    @OneToMany(mappedBy = "Packages")
    @JsonIgnore
    private List<Payment> payments;

    @OneToMany(mappedBy = "Packages")
    @JsonIgnore
    private List<Feedback> feedbacks;

}
