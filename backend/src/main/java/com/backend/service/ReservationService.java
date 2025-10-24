package com.backend.service;

import com.backend.entity.Reservation;
import com.backend.entity.Guide;
import com.backend.entity.enums.ReservationStatus;
import com.backend.repository.ReservationRepository;
import com.backend.repository.GuideRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final NotificationService notificationService;
    private final GuideRepository guideRepository;

    public ReservationService(ReservationRepository reservationRepository,
            NotificationService notificationService,
            GuideRepository guideRepository) {
        this.reservationRepository = reservationRepository;
        this.notificationService = notificationService;
        this.guideRepository = guideRepository;
    }

    public List<Reservation> getAllActiveReservations() {
        return reservationRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Reservation> getHistoryByUser(Long userId) {
        return reservationRepository.findByClient_UserIDOrderByCreatedAtDesc(userId);
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
