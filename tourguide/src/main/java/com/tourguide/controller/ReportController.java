package com.backend.controller.Analyse;

import com.backend.dto.Analyse.ReportDTO;
import com.backend.service.Analyse.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/daily")
    public ResponseEntity<List<ReportDTO>> getDailyReport(
            @RequestParam(defaultValue = "30") int days) {
        try {
            List<ReportDTO> dailyReport = reportService.getDailyReport(days);
            return ResponseEntity.ok(dailyReport);
        } catch (Exception e) {
            System.err.println("Error in getDailyReport: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<ReportDTO>> getWeeklyReport(
            @RequestParam(defaultValue = "12") int weeks) {
        try {
            List<ReportDTO> weeklyReport = reportService.getWeeklyReport(weeks);
            return ResponseEntity.ok(weeklyReport);
        } catch (Exception e) {
            System.err.println("Error in getWeeklyReport: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<ReportDTO>> getMonthlyReport(
            @RequestParam(defaultValue = "12") int months) {
        try {
            List<ReportDTO> monthlyReport = reportService.getMonthlyReport(months);
            return ResponseEntity.ok(monthlyReport);
        } catch (Exception e) {
            System.err.println("Error in getMonthlyReport: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/package-sales")
    public ResponseEntity<List<ReportDTO>> getPackageWiseSales(
            @RequestParam(defaultValue = "30") int days) {
        try {
            List<ReportDTO> packageSales = reportService.getPackageWiseSales(days);
            return ResponseEntity.ok(packageSales);
        } catch (Exception e) {
            System.err.println("Error in getPackageWiseSales: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<Object> getDashboardSummary() {
        try {
            Object summary = reportService.getDashboardSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            System.err.println("Error in getDashboardSummary: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Report Service",
                "timestamp", java.time.LocalDate.now().toString()));
    }
}