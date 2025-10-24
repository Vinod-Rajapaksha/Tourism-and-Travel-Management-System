package com.example.ttms.controllers;

import com.example.ttms.models.Client;
import com.example.ttms.models.Guide;
import com.example.ttms.models.PackageEntity;
import com.example.ttms.models.Reservation;
import com.example.ttms.repositories.ClientRepository;
import com.example.ttms.repositories.GuideRepository;
import com.example.ttms.repositories.PackageRepository;
import com.example.ttms.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestDataController {

    @Autowired
    private GuideRepository guideRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private PackageRepository packageRepository;
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "message", "TTMS Backend is running",
            "timestamp", java.time.Instant.now().toString()
        ));
    }

    @GetMapping("/test-login")
    public ResponseEntity<Map<String, String>> testLogin() {
        return ResponseEntity.ok(Map.of(
            "message", "Test login endpoint working",
            "guide_credentials", "guide1@test.com / password123",
            "customer_credentials", "customer1@test.com / password123",
            "note", "Use these credentials in the frontend login form"
        ));
    }

    @PostMapping("/add-sample-tours")
    public ResponseEntity<Map<String, String>> addSampleTours() {
        try {
            // Add sample packages
            PackageEntity package1 = new PackageEntity();
            package1.setPackageID(1001);
            package1.setTitle("Colombo City Tour");
            package1.setDescription("Explore the capital city of Sri Lanka");
            package1.setImage("colombo.jpg");
            package1.setPrice(new BigDecimal("8000.00"));
            package1.setStatus("Active");
            package1.setOffer(new BigDecimal("5.0"));

            PackageEntity package2 = new PackageEntity();
            package2.setPackageID(1002);
            package2.setTitle("Kandy Cultural Experience");
            package2.setDescription("Visit the Temple of the Tooth and cultural sites");
            package2.setImage("kandy.jpg");
            package2.setPrice(new BigDecimal("12000.00"));
            package2.setStatus("Active");
            package2.setOffer(new BigDecimal("10.0"));

            PackageEntity package3 = new PackageEntity();
            package3.setPackageID(1003);
            package3.setTitle("Galle Fort Heritage");
            package3.setDescription("Historical tour of Galle Fort");
            package3.setImage("galle.jpg");
            package3.setPrice(new BigDecimal("15000.00"));
            package3.setStatus("Active");
            package3.setOffer(new BigDecimal("0.0"));

            // Save packages
            packageRepository.save(package1);
            packageRepository.save(package2);
            packageRepository.save(package3);

            // Get test users
            Guide testGuide = guideRepository.findById(999).orElse(null);
            Client testCustomer = clientRepository.findById(999).orElse(null);

            if (testGuide == null || testCustomer == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Test users not found. Please run /add-test-users first."
                ));
            }

            // Add sample completed reservations
            Reservation reservation1 = new Reservation();
            reservation1.setReservationID(2001);
            reservation1.setStartDate(LocalDate.of(2024, 10, 1));
            reservation1.setEndDate(LocalDate.of(2024, 10, 3));
            reservation1.setStatus("COMPLETED");
            reservation1.setGuide(testGuide);
            reservation1.setClient(testCustomer);
            reservation1.setPack(package1);

            Reservation reservation2 = new Reservation();
            reservation2.setReservationID(2002);
            reservation2.setStartDate(LocalDate.of(2024, 10, 5));
            reservation2.setEndDate(LocalDate.of(2024, 10, 7));
            reservation2.setStatus("COMPLETED");
            reservation2.setGuide(testGuide);
            reservation2.setClient(testCustomer);
            reservation2.setPack(package2);

            Reservation reservation3 = new Reservation();
            reservation3.setReservationID(2003);
            reservation3.setStartDate(LocalDate.of(2024, 10, 10));
            reservation3.setEndDate(LocalDate.of(2024, 10, 12));
            reservation3.setStatus("COMPLETED");
            reservation3.setGuide(testGuide);
            reservation3.setClient(testCustomer);
            reservation3.setPack(package3);

            // Save reservations
            reservationRepository.save(reservation1);
            reservationRepository.save(reservation2);
            reservationRepository.save(reservation3);

            return ResponseEntity.ok(Map.of(
                "message", "Sample tours and completed reservations added successfully!",
                "packages", "3 packages added (Colombo, Kandy, Galle)",
                "reservations", "3 completed reservations added",
                "note", "Login as customer1@test.com to see completed tours for feedback"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to add sample tours: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/add-test-users")
    public ResponseEntity<Map<String, String>> addTestUsers() {
        try {
            // Add test guide
            Guide testGuide = new Guide();
            testGuide.setGuideID(999);
            testGuide.setFirstName("Test");
            testGuide.setLastName("Guide");
            testGuide.setEmail("guide1@test.com");
            testGuide.setPassword(passwordEncoder.encode("password123"));
            testGuide.setGender("Male");
            testGuide.setNic("999999999V");
            testGuide.setStatus("Available");
            
            guideRepository.save(testGuide);

            // Add test customer
            Client testCustomer = new Client();
            testCustomer.setUserID(999);
            testCustomer.setFirstName("Test");
            testCustomer.setLastName("Customer");
            testCustomer.setEmail("customer1@test.com");
            testCustomer.setPassword(passwordEncoder.encode("password123"));
            testCustomer.setGender("Female");
            testCustomer.setNic("888888888V");
            
            clientRepository.save(testCustomer);

            return ResponseEntity.ok(Map.of(
                "message", "Test users added successfully!",
                "guide", "guide1@test.com / password123",
                "customer", "customer1@test.com / password123"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to add test users: " + e.getMessage()
            ));
        }
    }
}
