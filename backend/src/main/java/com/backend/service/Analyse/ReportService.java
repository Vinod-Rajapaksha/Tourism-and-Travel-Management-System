package com.backend.service.Analyse;

import com.backend.dto.Analyse.ReportDTO;
import com.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<ReportDTO> getDailyReport(int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        List<Object[]> results = paymentRepository.getDailySalesReport(startDate);

        return results.stream()
                .map(result -> {
                    LocalDate date = ((java.sql.Date) result[0]).toLocalDate();
                    BigDecimal totalSales = (BigDecimal) result[1];
                    Long count = ((Number) result[2]).longValue();
                    BigDecimal avgPrice = count > 0
                            ? totalSales.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    return new ReportDTO(
                            date.toString(),
                            count.intValue(),
                            totalSales,
                            "Daily Sales - " + date,
                            avgPrice);
                })
                .sorted(Comparator.comparing(ReportDTO::getPeriod))
                .collect(Collectors.toList());
    }

    public List<ReportDTO> getWeeklyReport(int weeks) {
        LocalDateTime startDate = LocalDateTime.now().minusWeeks(weeks);
        List<Object[]> results = paymentRepository.getWeeklySalesReport(startDate);

        return results.stream()
                .map(result -> {
                    Integer year = (Integer) result[0];
                    Integer week = (Integer) result[1];
                    BigDecimal totalSales = (BigDecimal) result[2];
                    Long count = ((Number) result[3]).longValue();
                    BigDecimal avgPrice = count > 0
                            ? totalSales.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    String weekLabel = "Week " + String.format("%02d", week) + " " + year;
                    String period = year + "-W" + String.format("%02d", week);

                    return new ReportDTO(
                            period,
                            count.intValue(),
                            totalSales,
                            weekLabel,
                            avgPrice);
                })
                .sorted(Comparator.comparing(ReportDTO::getPeriod))
                .collect(Collectors.toList());
    }

    public List<ReportDTO> getMonthlyReport(int months) {
        LocalDateTime startDate = LocalDateTime.now().minusMonths(months);
        List<Object[]> results = paymentRepository.getMonthlySalesReport(startDate);

        return results.stream()
                .map(result -> {
                    Integer year = (Integer) result[0];
                    Integer month = (Integer) result[1];
                    BigDecimal totalSales = (BigDecimal) result[2];
                    Long count = ((Number) result[3]).longValue();
                    BigDecimal avgPrice = count > 0
                            ? totalSales.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    String monthName = getMonthName(month) + " " + year;
                    String period = year + "-" + String.format("%02d", month);

                    return new ReportDTO(
                            period,
                            count.intValue(),
                            totalSales,
                            monthName,
                            avgPrice);
                })
                .sorted(Comparator.comparing(ReportDTO::getPeriod))
                .collect(Collectors.toList());
    }

    public List<ReportDTO> getPackageWiseSales(int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        LocalDateTime endDate = LocalDateTime.now();

        List<Object[]> results = paymentRepository.getPackageSalesByDateRange(startDate, endDate);

        return results.stream()
                .map(result -> {
                    String packageName = (String) result[0];
                    Long count = ((Number) result[1]).longValue();
                    BigDecimal totalSales = (BigDecimal) result[2];
                    BigDecimal avgPrice = count > 0
                            ? totalSales.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    return new ReportDTO(
                            "Package Summary",
                            count.intValue(),
                            totalSales,
                            packageName,
                            avgPrice);
                })
                .sorted((d1, d2) -> d2.getTotalSales().compareTo(d1.getTotalSales()))
                .collect(Collectors.toList());
    }

    private String getMonthName(int month) {
        String[] monthNames = {
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
        };
        return monthNames[month - 1];
    }

    public Object getDashboardSummary() {
        List<Object[]> stats = paymentRepository.getPaymentStatistics();
        if (stats.isEmpty()) {
            return null;
        }

        Object[] result = stats.get(0);
        return new Object() {
            public final Long totalCount = ((Number) result[0]).longValue();
            public final BigDecimal successAmount = (BigDecimal) result[1];
            public final BigDecimal pendingAmount = (BigDecimal) result[2];
            public final BigDecimal failedAmount = (BigDecimal) result[3];
            public final BigDecimal refundedAmount = (BigDecimal) result[4];
        };
    }
}
