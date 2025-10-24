package com.backend.repository;

import com.backend.entity.Payment;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

  List<Payment> findByStatus(String status);

  @Query("SELECT p FROM Payment p WHERE p.client.userID = :userId")
  List<Payment> findByUserId(@Param("userId") Long userId);

  @Query("SELECT p FROM Payment p WHERE p.packages.packageID = :packageId")
  List<Payment> findByPackageId(@Param("packageId") Long packageId);

  @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
  List<Payment> findByPaymentDateBetween(@Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate);

  @Query("SELECT p FROM Payment p WHERE p.status = 'SUCCESS' AND p.paymentDate BETWEEN :startDate AND :endDate")
  List<Payment> findSuccessPaymentsBetween(@Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate);

  @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'SUCCESS'")
  BigDecimal sumSuccessfulAmount();

  @Query(value = """
      SELECT
          CAST(DATEFROMPARTS(YEAR(paymentDate), MONTH(paymentDate), 1) AS DATE) AS monthStart,
          SUM(amount) AS total
      FROM Payment
      WHERE status = 'SUCCESS'
        AND paymentDate >= DATEADD(MONTH, -:months + 1,
            DATEFROMPARTS(YEAR(SYSUTCDATETIME()), MONTH(SYSUTCDATETIME()), 1))
      GROUP BY DATEFROMPARTS(YEAR(paymentDate), MONTH(paymentDate), 1)
      ORDER BY monthStart
      """, nativeQuery = true)
  List<Object[]> monthlySuccessfulSums(@Param("months") int months);

  @Query(value = """
      SELECT
          CAST(paymentDate AS DATE) AS date,
          COALESCE(SUM(amount), 0) AS totalSales,
          COUNT(paymentID) AS count
      FROM Payment
      WHERE status = 'SUCCESS'
        AND paymentDate >= :startDate
      GROUP BY CAST(paymentDate AS DATE)
      ORDER BY CAST(paymentDate AS DATE)
      """, nativeQuery = true)
  List<Object[]> getDailySalesReport(@Param("startDate") LocalDateTime startDate);

  @Query(value = """
      SELECT
          DATEPART(YEAR, p.paymentDate) AS year,
          DATEPART(WEEK, p.paymentDate) AS week,
          COALESCE(SUM(p.amount), 0) AS totalSales,
          COUNT(p.paymentID) AS count
      FROM Payment p
      WHERE p.status = 'SUCCESS'
        AND p.paymentDate >= :startDate
      GROUP BY DATEPART(YEAR, p.paymentDate), DATEPART(WEEK, p.paymentDate)
      ORDER BY DATEPART(YEAR, p.paymentDate), DATEPART(WEEK, p.paymentDate)
      """, nativeQuery = true)
  List<Object[]> getWeeklySalesReport(@Param("startDate") LocalDateTime startDate);

  @Query(value = """
      SELECT
          DATEPART(YEAR, p.paymentDate) AS year,
          DATEPART(MONTH, p.paymentDate) AS month,
          COALESCE(SUM(p.amount), 0) AS totalSales,
          COUNT(p.paymentID) AS count
      FROM Payment p
      WHERE p.status = 'SUCCESS'
        AND p.paymentDate >= :startDate
      GROUP BY DATEPART(YEAR, p.paymentDate), DATEPART(MONTH, p.paymentDate)
      ORDER BY DATEPART(YEAR, p.paymentDate), DATEPART(MONTH, p.paymentDate)
      """, nativeQuery = true)
  List<Object[]> getMonthlySalesReport(@Param("startDate") LocalDateTime startDate);

  @Query("""
      SELECT p.packages.title, COUNT(p), COALESCE(SUM(p.amount), 0)
      FROM Payment p
      WHERE p.status = 'SUCCESS' AND p.paymentDate BETWEEN :startDate AND :endDate
      GROUP BY p.packages.title
      ORDER BY SUM(p.amount) DESC
      """)
  List<Object[]> getPackageSalesByDateRange(@Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate);

  @Query("""
      SELECT
          COUNT(p),
          COALESCE(SUM(CASE WHEN p.status = 'SUCCESS' THEN p.amount ELSE 0 END), 0),
          COALESCE(SUM(CASE WHEN p.status = 'PENDING' THEN p.amount ELSE 0 END), 0),
          COALESCE(SUM(CASE WHEN p.status = 'FAILED' THEN p.amount ELSE 0 END), 0),
          COALESCE(SUM(CASE WHEN p.status = 'REFUNDED' THEN p.amount ELSE 0 END), 0)
      FROM Payment p
      """)
  List<Object[]> getPaymentStatistics();

  @Query(value = """
      SELECT pkg.packageID, pkg.title, pkg.description, pkg.price, pkg.offer, pkg.image, COUNT(p.paymentID)
      FROM Payment p
      JOIN Packages pkg ON p.packageID = pkg.packageID
      WHERE p.status = 'SUCCESS' AND p.paymentDate >= :startDate
      GROUP BY pkg.packageID, pkg.title, pkg.description, pkg.price, pkg.offer, pkg.image
      ORDER BY COUNT(p.paymentID) DESC
      """, nativeQuery = true)
  Optional<Object[]> findMostPopularPackageLast7Days(@Param("startDate") LocalDateTime startDate);

  @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status")
  BigDecimal getTotalAmountByStatus(@Param("status") String status);

  @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'SUCCESS'")
  BigDecimal getTotalSuccessAmount();

  long countByStatus(String status);

  @Query("SELECT p FROM Payment p ORDER BY p.paymentDate DESC")
  List<Payment> findRecentPayments();

  @Query("SELECT p FROM Payment p WHERE p.status = 'PENDING' AND p.paymentDate < :cutoffTime")
  List<Payment> findExpiredPendingPayments(@Param("cutoffTime") LocalDateTime cutoffTime);
}
