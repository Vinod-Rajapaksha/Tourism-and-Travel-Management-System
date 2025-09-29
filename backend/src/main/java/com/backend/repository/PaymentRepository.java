package com.backend.repository;

import com.backend.entity.Payment;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Gross earnings = sum of successful payments
    @Query(value = "SELECT COALESCE(SUM(amount), 0) FROM Payment WHERE status = 'SUCCESS'", nativeQuery = true)
    BigDecimal sumSuccessfulAmount();

    // Monthly successful sums over the last :months (inclusive of current month)
    @Query(value = """
            SELECT
                CAST(DATEFROMPARTS(YEAR(paymentDate), MONTH(paymentDate), 1) AS DATE) AS monthStart,
                SUM(amount) AS total
            FROM Payment
            WHERE status = 'SUCCESS'
              AND paymentDate >= DATEADD(MONTH, -:months + 1, DATEFROMPARTS(YEAR(SYSUTCDATETIME()), MONTH(SYSUTCDATETIME()), 1))
            GROUP BY DATEFROMPARTS(YEAR(paymentDate), MONTH(paymentDate), 1)
            ORDER BY monthStart
            """, nativeQuery = true)
    List<Object[]> monthlySuccessfulSums(@Param("months") int months);
}
