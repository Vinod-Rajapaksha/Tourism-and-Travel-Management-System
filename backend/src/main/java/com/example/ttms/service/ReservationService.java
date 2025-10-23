/*package com.example.ttms.service;

import com.example.ttms.model.Reservation;
import com.example.ttms.model.ReservationStatus;
import com.example.ttms.repo.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.ttms.repo.GuideRepository;

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
        return reservationRepository.findByUserIDAndDeletedFalseOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Reservation confirmReservation(Long id, Long guideId) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + id));
        if (r.getDeleted() != null && r.getDeleted()) {
            throw new RuntimeException("Reservation already deleted: " + id);
        }
        r.setStatus(ReservationStatus.CONFIRMED);
        r.setUpdatedAt(LocalDateTime.now());

        if(guideId != null) {
            if (!guideRepository.existsById(guideId)) {
            throw new RuntimeException("Guide not found: " + guideId);
            }
            r.setGuideID(guideId);
        }
        Reservation saved = reservationRepository.save(r);

        // send notification (console or mail)
        notificationService.sendConfirmation(saved);

        return saved;
    }

    @Transactional
    public Reservation updateStatus(Long id, ReservationStatus newStatus) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + id));

        if (r.getDeleted() != null && r.getDeleted()) {
            throw new RuntimeException("Reservation already deleted: " + id);
        }

        if (!isAllowedTransition(r.getStatus(), newStatus)) {
            throw new IllegalArgumentException("Invalid status transition: " + r.getStatus() + " -> " + newStatus);
        }

        r.setStatus(newStatus);
        r.setUpdatedAt(LocalDateTime.now());
        return reservationRepository.save(r);
    }

    @Transactional
    public void deleteReservation(Long id) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + id));
        // soft delete
        r.setDeleted(true);
        r.setUpdatedAt(LocalDateTime.now());
        reservationRepository.save(r);
    }

    public Reservation findById(Long id) {
        return reservationRepository.findById(id)
                .filter(r -> !r.getDeleted())
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    private boolean isAllowedTransition(ReservationStatus current, ReservationStatus next) {
        if (current == null) return true;
        if (current == ReservationStatus.COMPLETED || current == ReservationStatus.REFUNDED) {
            // don't allow transitions out of terminal states
            return false;
        }
        // basic rules
        if (current == ReservationStatus.PENDING) return true;
        if (current == ReservationStatus.CONFIRMED && (next == ReservationStatus.CANCELLED || next == ReservationStatus.COMPLETED || next == ReservationStatus.REFUNDED)) return true;
        if (current == ReservationStatus.CANCELLED && next == ReservationStatus.REFUNDED) return true;
        return next == current; // allow idempotent set
    }
    @Transactional
    public Reservation assignGuide(Long reservationId, Long guideId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + reservationId));

        if (reservation.getDeleted() != null && reservation.getDeleted()) {
            throw new RuntimeException("Reservation already deleted: " + reservationId);
        }
        if (!guideRepository.existsById(guideId)) {
            throw new RuntimeException("Guide not found: " + guideId);
        }

        reservation.setGuideID(guideId);
        reservation.setUpdatedAt(LocalDateTime.now());

        Reservation saved = reservationRepository.save(reservation);

        notificationService.sendConfirmation(saved);

        return saved;
    }

}*/
package com.example.ttms.service;

import com.example.ttms.model.Reservation;
import com.example.ttms.model.ReservationStatus;
import com.example.ttms.repo.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.ttms.repo.GuideRepository;

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

    // Get all reservations (active or not)
    public List<Reservation> getAllActiveReservations() {
        return reservationRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get reservation history by user
    public List<Reservation> getHistoryByUser(Long userId) {
        return reservationRepository.findByUserIDOrderByCreatedAtDesc(userId);
    }

    // Confirm reservation and optionally assign a guide
    @Transactional
    public Reservation confirmReservation(Long id, Long guideId) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + id));

        r.setStatus(ReservationStatus.CONFIRMED);
        r.setUpdatedAt(LocalDateTime.now());

        if (guideId != null) {
            if (!guideRepository.existsById(guideId)) {
                throw new RuntimeException("Guide not found: " + guideId);
            }
            r.setGuideID(guideId);
        }

        Reservation saved = reservationRepository.save(r);
        notificationService.sendConfirmation(saved);
        return saved;
    }

    // Update booking status
    @Transactional
    public Reservation updateStatus(Long id, ReservationStatus newStatus) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + id));

        if (!isAllowedTransition(r.getStatus(), newStatus)) {
            throw new IllegalArgumentException("Invalid status transition: " + r.getStatus() + " -> " + newStatus);
        }

        r.setStatus(newStatus);
        r.setUpdatedAt(LocalDateTime.now());
        Reservation updated = reservationRepository.save(r);

        if (newStatus == ReservationStatus.CONFIRMED) {
            notificationService.sendConfirmation(updated);
        }

        return updated;
    }

    // Permanently delete reservation (since we removed soft-delete)
    @Transactional
    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reservation not found: " + id);
        }
        reservationRepository.deleteById(id);
    }

    // Find by ID
    public Reservation findById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    // Assign guide
    @Transactional
    public Reservation assignGuide(Long reservationId, Long guideId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + reservationId));

        if (!guideRepository.existsById(guideId)) {
            throw new RuntimeException("Guide not found: " + guideId);
        }

        reservation.setGuideID(guideId);
        reservation.setUpdatedAt(LocalDateTime.now());

        Reservation saved = reservationRepository.save(reservation);
        notificationService.sendConfirmation(saved);
        return saved;
    }

    // Helper to check valid status transitions
    private boolean isAllowedTransition(ReservationStatus current, ReservationStatus next) {
        if (current == null) return true;
        if (current == ReservationStatus.COMPLETED || current == ReservationStatus.REFUNDED) {
            return false; // terminal states
        }
        if (current == ReservationStatus.PENDING) return true;
        if (current == ReservationStatus.CONFIRMED && (
                next == ReservationStatus.CANCELLED ||
                        next == ReservationStatus.COMPLETED ||
                        next == ReservationStatus.REFUNDED)) return true;
        if (current == ReservationStatus.CANCELLED && next == ReservationStatus.REFUNDED) return true;
        return next == current;
    }
}



