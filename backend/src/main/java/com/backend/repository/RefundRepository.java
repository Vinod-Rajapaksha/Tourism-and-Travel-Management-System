package com.backend.repository;

import com.backend.entity.Refund;
import org.springframework.data.jpa.repository.*;

import java.math.BigDecimal;

public interface RefundRepository extends JpaRepository<Refund, Long> {

    // Only count refunds actually issued
    @Query(value = "SELECT COALESCE(SUM(amount), 0) FROM Refund WHERE status IN ('APPROVED','ISSUED')", nativeQuery = true)
    BigDecimal sumRefundsIssued();
}
