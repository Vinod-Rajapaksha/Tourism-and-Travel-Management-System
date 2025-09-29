package com.backend.dto.dashboard;

import java.time.LocalDate;

public record RecentBookingDTO(
        Long reservationId,
        String code,
        String customer,
        String tourType,
        LocalDate date,
        String status) {
}
