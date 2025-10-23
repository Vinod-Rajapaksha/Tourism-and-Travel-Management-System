/*package com.example.ttms.controller;

import com.example.ttms.model.Reservation;
import com.example.ttms.model.ReservationStatus;
import com.example.ttms.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map; // ✅ needed for request body Map

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*") // allow frontend
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // ✅ Get active reservations
    @GetMapping
    public List<Reservation> getAllActive() {
        return reservationService.getAllActiveReservations();
    }

    // ✅ Get booking history by user
    @GetMapping("/history/{userId}")
    public List<Reservation> getHistory(@PathVariable Long userId) {
        return reservationService.getHistoryByUser(userId);
    }

    // ✅ Confirm reservation
    @PostMapping("/{id}/confirm")
    public Reservation confirm(@PathVariable Long id, @RequestBody(required = false) Map<String, Long> body) {
        try {
            Long guideId = (body != null) ? body.get("guideId") : null;
            return reservationService.confirmReservation(id, guideId);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    // ✅ Update status (Confirmed, Completed, etc.)
    @PutMapping("/{id}/status")
    public Reservation updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest req) {
        try {
            ReservationStatus newStatus = ReservationStatus.valueOf(req.getStatus());
            return reservationService.updateStatus(id, newStatus);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    // ✅ Delete reservation
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        try {
            reservationService.deleteReservation(id);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    // ✅ Assign tour guide (NEW FEATURE)
    @PutMapping("/{id}/assign-guide")
    public ResponseEntity<?> assignGuide(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        try {
            Long guideId = body.get("guideId"); // ✅ get guideId safely
            Reservation updated = reservationService.assignGuide(id, guideId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    // ✅ Helper class for updating status
    public static class StatusUpdateRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
} */
package com.example.ttms.controller;

import com.example.ttms.model.Reservation;
import com.example.ttms.model.ReservationStatus;
import com.example.ttms.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // Get active reservations
    @GetMapping
    public List<Reservation> getAllActive() {
        return reservationService.getAllActiveReservations();
    }

    // Get reservation by ID (NEW)
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        try {
            Reservation reservation = reservationService.findById(id);
            return ResponseEntity.ok(reservation);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    // Get booking history by user
    @GetMapping("/history/{userId}")
    public List<Reservation> getHistory(@PathVariable Long userId) {
        return reservationService.getHistoryByUser(userId);
    }

    // Confirm reservation
    @PostMapping("/{id}/confirm")
    public Reservation confirm(@PathVariable Long id, @RequestBody(required = false) Map<String, Long> body) {
        try {
            Long guideId = (body != null) ? body.get("guideId") : null;
            return reservationService.confirmReservation(id, guideId);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    // Update status
    @PutMapping("/{id}/status")
    public Reservation updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest req) {
        try {
            ReservationStatus newStatus = ReservationStatus.valueOf(req.getStatus());
            return reservationService.updateStatus(id, newStatus);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    // Delete reservation
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        try {
            reservationService.deleteReservation(id);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    // Assign tour guide
    @PutMapping("/{id}/assign-guide")
    public ResponseEntity<?> assignGuide(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        try {
            Long guideId = body.get("guideId");
            Reservation updated = reservationService.assignGuide(id, guideId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    // Helper class for updating status
    public static class StatusUpdateRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}

