package com.backend.repository;

import com.backend.entity.Reservation;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query(value = "SELECT COUNT(*) FROM Reservation", nativeQuery = true)
    long totalReservations();

    @Query(value = "SELECT COUNT(*) FROM Reservation WHERE status IN ('COMPLETED','REFUNDED')", nativeQuery = true)
    long completedReservations();

    @Query(value = """
            SELECT COUNT(DISTINCT userID)
            FROM Reservation
            WHERE createdAt >= DATEADD(DAY, -:days, SYSUTCDATETIME())
            """, nativeQuery = true)
    long activeUsersLastDays(@Param("days") int days);

    @Query(value = """
            SELECT TOP (:limit)
                r.reservationID,
                CONCAT(c.fName, ' ', c.lName) AS customer,
                p.title AS tourType,
                CAST(r.startDate AS DATE) AS startDate,
                r.status
            FROM Reservation r
            JOIN Client c   ON c.userID = r.userID
            JOIN Packages p ON p.packageID = r.packageID
            ORDER BY r.createdAt DESC
            """, nativeQuery = true)
    List<Object[]> recentBookings(@Param("limit") int limit);

    @Query(value = """
            SELECT TOP (:limit)
                p.title,
                COUNT(*) AS cnt
            FROM Reservation r
            JOIN Packages p ON p.packageID = r.packageID
            WHERE r.createdAt >= DATEADD(MONTH, -:months, SYSUTCDATETIME())
            GROUP BY p.title
            ORDER BY cnt DESC
            """, nativeQuery = true)
    List<Object[]> topPackageCounts(@Param("months") int months, @Param("limit") int limit);

    @Query(value = """
            SELECT COUNT(*)
            FROM Reservation r
            WHERE r.createdAt >= DATEADD(MONTH, -:months, SYSUTCDATETIME())
            """, nativeQuery = true)
    long totalReservationsInPeriod(@Param("months") int months);

    @Query("SELECT DISTINCT r FROM Reservation r ORDER BY r.createdAt DESC")
    List<Reservation> findAllByOrderByCreatedAtDesc();

    List<Reservation> findByClient_UserIDOrderByCreatedAtDesc(Long userId);

}
