package com.backend.service;

import com.backend.dto.dashboard.*;
import com.backend.repository.PaymentRepository;
import com.backend.repository.RefundRepository;
import com.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final PaymentRepository paymentRepo;
    private final RefundRepository refundRepo;
    private final ReservationRepository reservationRepo;

    public DashboardResponseDTO getDashboard(Authentication auth, int months, int recentLimit, int activeDays,
            int packageMonths, int packageLimit) {

        // 1) Earnings (gross, refunds, net)
        BigDecimal gross = opt(paymentRepo.sumSuccessfulAmount());
        BigDecimal refunds = opt(refundRepo.sumRefundsIssued());
        BigDecimal net = gross.subtract(refunds);
        if (net.compareTo(BigDecimal.ZERO) < 0)
            net = BigDecimal.ZERO;

        // 2) Counts
        long totalBookings = reservationRepo.totalReservations();
        long completedBookings = reservationRepo.completedReservations();
        long activeUsers = reservationRepo.activeUsersLastDays(activeDays);

        // 3) Monthly earning series (ensure missing months show as 0)
        Map<LocalDate, Double> monthMap = new LinkedHashMap<>();
        LocalDate start = LocalDate.now().withDayOfMonth(1).minusMonths(months - 1);
        for (int i = 0; i < months; i++) {
            monthMap.put(start.plusMonths(i), 0d);
        }
        for (Object[] row : paymentRepo.monthlySuccessfulSums(months)) {
            LocalDate monthStart = ((java.sql.Date) row[0]).toLocalDate();
            double total = ((Number) row[1]).doubleValue();
            monthMap.put(monthStart, total);
        }
        List<MonthlyPointDTO> earningSeries = monthMap.entrySet().stream()
                .map(e -> new MonthlyPointDTO(
                        e.getKey(),
                        e.getKey().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " "
                                + e.getKey().getYear(),
                        e.getValue()))
                .collect(Collectors.toList());

        // 4) Package share (top packages in period, % of total reservations in top
        // packages)
        List<Object[]> topPackages = reservationRepo.topPackageCounts(packageMonths, packageLimit);
        long totalTopPackageReservations = topPackages.stream()
                .mapToLong(r -> ((Number) r[1]).longValue())
                .sum();
        List<SharePointDTO> packageShare = topPackages.stream()
                .map(r -> {
                    String title = (String) r[0];
                    long cnt = ((Number) r[1]).longValue();
                    double pct = totalTopPackageReservations > 0 ? (cnt * 100.0) / totalTopPackageReservations : 0;
                    return new SharePointDTO(title, round1(pct));
                })
                .collect(Collectors.toList());

        // 5) Recent bookings
        List<RecentBookingDTO> recent = reservationRepo.recentBookings(recentLimit).stream()
                .map(r -> {
                    Long id = ((Number) r[0]).longValue();
                    String customer = (String) r[1];
                    String tourType = (String) r[2];
                    LocalDate date = ((java.sql.Date) r[3]).toLocalDate();
                    String status = (String) r[4];
                    String code = "BK-" + String.format("%04d", id);
                    return new RecentBookingDTO(id, code, customer, tourType, date, status);
                })
                .collect(Collectors.toList());

        String fName = (auth != null && auth.getName() != null) ? auth.getName() : "Manager";

        return new DashboardResponseDTO(
                fName,
                net,
                gross,
                refunds,
                totalBookings,
                completedBookings,
                activeUsers,
                earningSeries,
                packageShare,
                recent);
    }

    private static BigDecimal opt(BigDecimal b) {
        return b == null ? BigDecimal.ZERO : b;
    }

    private static double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }
}
