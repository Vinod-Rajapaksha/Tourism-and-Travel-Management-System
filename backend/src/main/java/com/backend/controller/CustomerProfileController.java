package com.backend.controller;

import com.backend.dto.CustomerProfileDto;
import com.backend.dto.CustomerUpdateDto;
import com.backend.entity.Client;
import com.backend.entity.Reservation;
import com.backend.repository.ClientRepository;
import com.backend.repository.ReservationRepository;
import com.backend.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerProfileController {

    private final ReservationRepository reservationRepository;
    private final ClientRepository clientRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<CustomerProfileDto> getProfile(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        String email = jwtService.validateToken(token).getSubject();

        Optional<Client> clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Client client = clientOpt.get();
        CustomerProfileDto dto = new CustomerProfileDto(
                client.getUserID(),
                client.getFirstName(),
                client.getLastName(),
                client.getEmail(),
                client.getPhone(),
                client.getNic(),
                client.getGender().toString(),
                client.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        );
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(HttpServletRequest request, 
                                         @Valid @RequestBody CustomerUpdateDto updateDto) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        String email = jwtService.validateToken(token).getSubject();

        Optional<Client> clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Client client = clientOpt.get();
        client.setFirstName(updateDto.getFirstName());
        client.setLastName(updateDto.getLastName());
        client.setPhone(updateDto.getPhone());
        client.setEmail(updateDto.getEmail());
        
        if (updateDto.getPassword() != null && !updateDto.getPassword().isEmpty()) {
            client.setPassword(passwordEncoder.encode(updateDto.getPassword()));
        }
        
        clientRepository.save(client);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteProfile(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        String email = jwtService.validateToken(token).getSubject();

        Optional<Client> clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isEmpty())
            return ResponseEntity.notFound().build();

        clientRepository.delete(clientOpt.get());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/bookings")
    public List<Reservation> bookingHistory(@RequestParam("email") String email) {
        return reservationRepository.findHistoryByEmail(email);
    }
}


