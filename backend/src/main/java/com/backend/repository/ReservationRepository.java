package com.backend.repository;

import com.backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.Packages.packageID = :packageId AND r.status IN ('PENDING','CONFIRMED') AND (r.startDate <= :endDate AND r.endDate >= :startDate)")
    boolean existsActiveOverlap(@Param("packageId") Long packageId,
                                @Param("startDate") LocalDate startDate,
                                @Param("endDate") LocalDate endDate);

    @Query("SELECT r FROM Reservation r WHERE r.client.email = :email ORDER BY r.createdAt DESC")
    List<Reservation> findHistoryByEmail(@Param("email") String email);
}
