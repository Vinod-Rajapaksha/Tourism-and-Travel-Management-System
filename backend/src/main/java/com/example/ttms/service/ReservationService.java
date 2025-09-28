package com.example.ttms.service;

import com.example.ttms.model.Reservation;
import com.example.ttms.repo.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation confirmReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow();
        reservation.setStatus(com.example.ttms.model.ReservationStatus.CONFIRMED);
        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}

