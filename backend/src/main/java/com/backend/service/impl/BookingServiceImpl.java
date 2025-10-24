package com.backend.service.impl;

import com.backend.dto.BookingRequestDTO;
import com.backend.entity.*;
import com.backend.entity.enums.PaymentStatus;
import com.backend.entity.enums.ReservationStatus;
import com.backend.repository.ClientRepository;
import com.backend.repository.PackageRepository;
import com.backend.repository.PaymentRepository;
import com.backend.repository.ReservationRepository;
import com.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final PackageRepository packageRepository;
    private final ClientRepository clientRepository;

    @Override
    @Transactional
    public Reservation createBooking(BookingRequestDTO request) {
        Packages pkg = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));
        Client client = clientRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    Client c = new Client();
                    c.setEmail(request.getEmail());
                    c.setFirstName(request.getFirstName());
                    c.setLastName(request.getLastName());
                    c.setPhone(request.getPhone());
                    // DB requires non-null password; set a placeholder for standalone flow
                    c.setPassword("");
                    // NIC has a unique constraint and limited length. Use a 12-char placeholder: AUTO + 8 hex
                    String nicPlaceholder = "AUTO" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 8);
                    c.setNic(nicPlaceholder);
                    c.setCreatedAt(LocalDateTime.now());
                    return clientRepository.save(c);
                });

        boolean invalidDates = request.getStartDate() == null || request.getEndDate() == null || request.getEndDate().isBefore(request.getStartDate());
        if (invalidDates) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date range");
        }

        boolean overlap = reservationRepository.existsActiveOverlap(pkg.getPackageID(), request.getStartDate(), request.getEndDate());
        if (overlap) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Package not available for selected dates");
        }

        // Create reservation without payment processing
        Reservation r = new Reservation();
        r.setClient(client);
        r.setPackages(pkg);
        r.setPayment(null); // No payment processing
        r.setStatus(ReservationStatus.PENDING); // Set to pending until payment is processed separately
        r.setStartDate(request.getStartDate());
        r.setEndDate(request.getEndDate());
        r.setCreatedAt(LocalDateTime.now());
        
        // Generate unique confirmation number
        String confirmationNumber = generateConfirmationNumber();
        r.setConfirmationNumber(confirmationNumber);
        
        return reservationRepository.save(r);
    }

    @Override
    @Transactional
    public Reservation cancelBooking(Long reservationId) {
        Reservation r = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));
        r.setStatus(ReservationStatus.CANCELLED);
        // No payment processing needed since payment is handled separately
        return reservationRepository.save(r);
    }

    @Override
    @Transactional
    public void deleteBooking(Long reservationId) {
        Reservation r = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));
        try {
            reservationRepository.delete(r);
        } catch (Exception ex) {
            // Fallback to soft-cancel if hard delete fails due to constraints
            r.setStatus(ReservationStatus.CANCELLED);
            Payment p = r.getPayment();
            if (p != null) {
                p.setStatus(PaymentStatus.REFUNDED);
                paymentRepository.save(p);
            }
            reservationRepository.save(r);
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot delete booking due to related records. It was cancelled instead.");
        }
    }

    private String generateConfirmationNumber() {
        // Generate confirmation number format: TT-YYYYMMDD-XXXX
        // TT = Travel Tourism, YYYYMMDD = current date, XXXX = random 4 digits
        LocalDateTime now = LocalDateTime.now();
        String datePart = String.format("%04d%02d%02d", now.getYear(), now.getMonthValue(), now.getDayOfMonth());
        String randomPart = String.format("%04d", (int) (Math.random() * 10000));
        return "TT-" + datePart + "-" + randomPart;
    }

    private PaymentStatus processPayment(BookingRequestDTO request) {
        // Simulate payment gateway processing
        // In a real implementation, this would integrate with actual payment gateways
        
        // Basic validation
        if (request.getCardNumber() == null || request.getCardNumber().length() < 13) {
            return PaymentStatus.FAILED;
        }
        
        if (request.getCvv() == null || request.getCvv().length() != 3) {
            return PaymentStatus.FAILED;
        }
        
        // Simulate random payment failures (5% failure rate)
        if (Math.random() < 0.05) {
            return PaymentStatus.FAILED;
        }
        
        return PaymentStatus.SUCCESS;
    }
}


