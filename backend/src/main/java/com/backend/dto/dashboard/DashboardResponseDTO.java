package com.backend.dto.dashboard;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponseDTO(
                String fName,
                BigDecimal totalEarningsNet,
                BigDecimal totalEarningsGross,
                BigDecimal totalRefunds,
                long totalBookings,
                long completedBookings,
                long activeUsers,
                List<MonthlyPointDTO> earningSeries,
                List<SharePointDTO> packageShare,
                List<RecentBookingDTO> recentBookings) {
}
