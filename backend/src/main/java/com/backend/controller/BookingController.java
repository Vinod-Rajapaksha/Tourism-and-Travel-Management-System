package com.backend.controller;

import com.backend.dto.BookingRequestDTO;
import com.backend.entity.Reservation;
import com.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/bookings")
    public ResponseEntity<Reservation> createBooking(@Valid @RequestBody BookingRequestDTO request) {
        Reservation reservation = bookingService.createBooking(request);
        return ResponseEntity.ok(reservation);
    }

    @PatchMapping("/bookings/{id}/cancel")
    public ResponseEntity<Reservation> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}


