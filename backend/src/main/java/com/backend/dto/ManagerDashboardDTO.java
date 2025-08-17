package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ManagerDashboardDTO {
    private long totalClients;
    private long totalBookings;
    private long totalPackages;
    private long totalRevenue;
}