package com.backend.repository;

import com.backend.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {

    @Query("SELECT p FROM Promotion p WHERE p.isActive = true")
    List<Promotion> findActivePromotions();

    @Query("SELECT p FROM Promotion p WHERE p.startDate <= :date AND p.endDate >= :date AND p.isActive = true")
    List<Promotion> findActivePromotionsByDate(@Param("date") LocalDate date);

    @Query("SELECT p FROM Promotion p WHERE p.startDate BETWEEN :startDate AND :endDate AND p.isActive = true")
    List<Promotion> findActivePromotionsByDateRange(@Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT p FROM Promotion p WHERE p.startDate >= :startDate AND p.isActive = true")
    List<Promotion> findActivePromotionsAfterDate(@Param("startDate") LocalDate startDate);
}
