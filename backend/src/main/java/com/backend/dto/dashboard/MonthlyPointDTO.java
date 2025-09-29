package com.backend.dto.dashboard;

import java.time.LocalDate;

public record MonthlyPointDTO(
        LocalDate monthStart,
        String monthLabel,
        double value) {
}
