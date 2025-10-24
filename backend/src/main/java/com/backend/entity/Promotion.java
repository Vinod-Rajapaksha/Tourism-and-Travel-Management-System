package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "Promotions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_id")
    private Integer promotionId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "time")
    private LocalTime time;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "current_price", precision = 10, scale = 2)
    private BigDecimal currentPrice;

    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "discount")
    private String discount;

    @Column(name = "duration")
    private String duration;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "promotion_type")
    private String promotionType;

    @Column(name = "terms_conditions", columnDefinition = "NVARCHAR(MAX)")
    private String termsConditions;

    @Column(name = "promotion_color")
    private String promotionColor;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Promotion(String title, LocalDate startDate, LocalDate endDate, LocalTime time,
            String description, BigDecimal currentPrice, BigDecimal originalPrice,
            String discount, String duration, Integer maxParticipants, String promotionType,
            String termsConditions, String promotionColor, Boolean isActive) {
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.time = time;
        this.description = description;
        this.currentPrice = currentPrice;
        this.originalPrice = originalPrice;
        this.discount = discount;
        this.duration = duration;
        this.maxParticipants = maxParticipants;
        this.promotionType = promotionType;
        this.termsConditions = termsConditions;
        this.promotionColor = promotionColor;
        this.isActive = isActive;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
