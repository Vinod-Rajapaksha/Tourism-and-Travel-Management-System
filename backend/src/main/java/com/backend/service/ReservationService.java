package com.backend.service;

import com.backend.entity.Reservation;
import com.backend.entity.Guide;
import com.backend.entity.Client;
import com.backend.entity.Packages;
import com.backend.entity.Payment;
import com.backend.entity.enums.ReservationStatus;
import com.backend.repository.ReservationRepository;
import com.backend.repository.GuideRepository;
import com.backend.repository.ClientRepository;
import com.backend.repository.PackageRepository;
import com.backend.repository.PaymentRepository;
import com.backend.dto.reservaton.ReservationCreateDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final NotificationService notificationService;
    private final GuideRepository guideRepository;
    private final ClientRepository clientRepository;
    private final PackageRepository packageRepository;
    private final PaymentRepository paymentRepository;

    public ReservationService(ReservationRepository reservationRepository,
            NotificationService notificationService,
            GuideRepository guideRepository,
            ClientRepository clientRepository,
            PackageRepository packageRepository,
            PaymentRepository paymentRepository) {
        this.reservationRepository = reservationRepository;
        this.notificationService = notificationService;
        this.guideRepository = guideRepository;
        this.clientRepository = clientRepository;
        this.packageRepository = packageRepository;
        this.paymentRepository = paymentRepository;
    }

    public List<Reservation> getAllActiveReservations() {
        return reservationRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Reservation> getHistoryByUser(Long userId) {
        return reservationRepository.findByClient_UserIDOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Reservation createReservation(ReservationCreateDTO dto) {
        if (dto.getUserId() == null || dto.getPackageId() == null) {
            throw new IllegalArgumentException("User ID and Package ID are required");
        }

        Client client = clientRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Client not found: " + dto.getUserId()));

        Packages pkg = packageRepository.findById(dto.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found: " + dto.getPackageId()));

        if (pkg.getAvailable() != null && pkg.getAvailable() > 0) {
            pkg.setAvailable(pkg.getAvailable() - 1);
            packageRepository.save(pkg);
        }

        Reservation reservation = new Reservation();
        reservation.setClient(client);
        reservation.setPackages(pkg);
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setStartDate(dto.getStartDate() != null ? dto.getStartDate() : java.time.LocalDate.now().plusDays(7));
        reservation.setEndDate(dto.getEndDate() != null ? dto.getEndDate() : java.time.LocalDate.now().plusDays(14));
        reservation.setCreatedAt(LocalDateTime.now());

        if (dto.getGuideId() != null) {
            Guide guide = guideRepository.findById(dto.getGuideId()).orElse(null);
            reservation.setGuide(guide);
        }

        if (dto.getPaymentId() != null) {
            Payment payment = paymentRepository.findById(dto.getPaymentId()).orElse(null);
            reservation.setPayment(payment);
        }

        Reservation saved = reservationRepository.save(reservation);
        try {
            notificationService.sendConfirmation(saved);
        } catch (Exception ignored) {
        }
        return saved;
    }

    @Transactional
    public Reservation confirmReservation(Long id, Long guideId) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + id));

        reservation.setStatus(ReservationStatus.CONFIRMED);

        if (guideId != null) {
            Guide guide = guideRepository.findById(guideId)
                    .orElseThrow(() -> new RuntimeException("Guide not found: " + guideId));
            reservation.setGuide(guide);
        }

        Reservation saved = reservationRepository.save(reservation);
        notificationService.sendConfirmation(saved);
        return saved;
    }

    @Transactional
    public Reservation updateStatus(Long id, ReservationStatus newStatus) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + id));

        if (!isAllowedTransition(reservation.getStatus(), newStatus)) {
            throw new IllegalArgumentException(
                    "Invalid status transition: " + reservation.getStatus() + " -> " + newStatus);
        }

        reservation.setStatus(newStatus);
        return reservationRepository.save(reservation);
    }

    @Transactional
    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reservation not found: " + id);
        }
        reservationRepository.deleteById(id);
    }

    public Reservation findById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    @Transactional
    public Reservation assignGuide(Long reservationId, Long guideId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + reservationId));

        Guide guide = guideRepository.findById(guideId)
                .orElseThrow(() -> new RuntimeException("Guide not found: " + guideId));

        reservation.setGuide(guide);

        Reservation saved = reservationRepository.save(reservation);
        notificationService.sendConfirmation(saved);
        return saved;
    }

    private boolean isAllowedTransition(ReservationStatus current, ReservationStatus next) {
        if (current == null)
            return true;
        if (current == ReservationStatus.COMPLETED || current == ReservationStatus.REFUNDED)
            return false;
        if (current == ReservationStatus.PENDING)
            return true;
        if (current == ReservationStatus.CONFIRMED && (next == ReservationStatus.CANCELLED ||
                next == ReservationStatus.COMPLETED ||
                next == ReservationStatus.REFUNDED))
            return true;
        if (current == ReservationStatus.CANCELLED && next == ReservationStatus.REFUNDED)
            return true;
        return next == current;
    }
}
