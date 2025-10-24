package com.backend.dto.adminProfile;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ManagerDashboardDTO {
    private long totalClients;
    private long totalBookings;
    private long totalPackages;
    private BigDecimal totalRevenue;
}