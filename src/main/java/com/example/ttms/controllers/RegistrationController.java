package com.example.ttms.controllers;

import com.example.ttms.dto.GuideDTO;
import com.example.ttms.dto.ClientDTO;
import com.example.ttms.models.Guide;
import com.example.ttms.models.Client;
import com.example.ttms.repositories.GuideRepository;
import com.example.ttms.repositories.ClientRepository;
import com.example.ttms.repositories.GuidePhoneRepository;
import com.example.ttms.repositories.ClientPhoneRepository;
import com.example.ttms.services.GuideService;
import com.example.ttms.services.ClientService;
import com.example.ttms.services.SampleDataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/api/register")
public class RegistrationController {
    private final GuideRepository guideRepository;
    private final ClientRepository clientRepository;
    private final GuidePhoneRepository guidePhoneRepository;
    private final ClientPhoneRepository clientPhoneRepository;
    private final PasswordEncoder passwordEncoder;
    private final GuideService guideService;
    private final ClientService clientService;
    private final SampleDataService sampleDataService;

    public RegistrationController(
            GuideRepository guideRepository,
            ClientRepository clientRepository,
            GuidePhoneRepository guidePhoneRepository,
            ClientPhoneRepository clientPhoneRepository,
            PasswordEncoder passwordEncoder,
            GuideService guideService,
            ClientService clientService,
            SampleDataService sampleDataService) {
        this.guideRepository = guideRepository;
        this.clientRepository = clientRepository;
        this.guidePhoneRepository = guidePhoneRepository;
        this.clientPhoneRepository = clientPhoneRepository;
        this.passwordEncoder = passwordEncoder;
        this.guideService = guideService;
        this.clientService = clientService;
        this.sampleDataService = sampleDataService;
    }

    @PostMapping("/guide")
    @Transactional
    public ResponseEntity<?> registerGuide(@RequestBody GuideRegistrationRequest request) {
        try {
            // Check if email already exists
            if (guideRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            // Check if NIC already exists
            if (guideRepository.findByNic(request.getNic()).isPresent()) {
                return ResponseEntity.badRequest().body("NIC already exists");
            }

            // Create new guide
            Guide guide = new Guide();
            guide.setFirstName(request.getFirstName());
            guide.setLastName(request.getLastName());
            guide.setEmail(request.getEmail());
            guide.setPassword(passwordEncoder.encode(request.getPassword()));
            guide.setGender(request.getGender());
            guide.setNic(request.getNic());
            guide.setStatus("Available");

            Guide savedGuide = guideRepository.save(guide);

            // Add phone numbers if provided
            if (request.getPhoneNumbers() != null && !request.getPhoneNumbers().isEmpty()) {
                for (String phoneNo : request.getPhoneNumbers()) {
                    if (phoneNo != null && !phoneNo.trim().isEmpty()) {
                        guidePhoneRepository.save(new com.example.ttms.models.GuidePhone(savedGuide.getGuideID(), phoneNo.trim()));
                    }
                }
            }

            // Add sample completed tours for the new guide
            sampleDataService.addSampleCompletedToursForNewGuide(savedGuide);

            GuideDTO guideDTO = guideService.toDTO(savedGuide);
            return ResponseEntity.status(HttpStatus.CREATED).body(guideDTO);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/customer")
    @Transactional
    public ResponseEntity<?> registerCustomer(@RequestBody CustomerRegistrationRequest request) {
        try {
            // Check if email already exists
            if (clientRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            // Check if NIC already exists
            if (clientRepository.findByNic(request.getNic()).isPresent()) {
                return ResponseEntity.badRequest().body("NIC already exists");
            }

            // Create new customer
            Client client = new Client();
            client.setFirstName(request.getFirstName());
            client.setLastName(request.getLastName());
            client.setEmail(request.getEmail());
            client.setPassword(passwordEncoder.encode(request.getPassword()));
            client.setGender(request.getGender());
            client.setNic(request.getNic());

            Client savedClient = clientRepository.save(client);

            // Add phone numbers if provided
            if (request.getPhoneNumbers() != null && !request.getPhoneNumbers().isEmpty()) {
                for (String phoneNo : request.getPhoneNumbers()) {
                    if (phoneNo != null && !phoneNo.trim().isEmpty()) {
                        clientPhoneRepository.save(new com.example.ttms.models.ClientPhone(savedClient.getUserID(), phoneNo.trim()));
                    }
                }
            }

            // Add sample completed tours for the new customer
            sampleDataService.addSampleCompletedToursForNewCustomer(savedClient);

            ClientDTO clientDTO = clientService.toDTO(savedClient);
            return ResponseEntity.status(HttpStatus.CREATED).body(clientDTO);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    // Inner classes for request DTOs
    public static class GuideRegistrationRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private String gender;
        private String nic;
        private List<String> phoneNumbers;

        // Getters and setters
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public String getNic() { return nic; }
        public void setNic(String nic) { this.nic = nic; }

        public List<String> getPhoneNumbers() { return phoneNumbers; }
        public void setPhoneNumbers(List<String> phoneNumbers) { this.phoneNumbers = phoneNumbers; }
    }

    public static class CustomerRegistrationRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private String gender;
        private String nic;
        private List<String> phoneNumbers;

        // Getters and setters
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public String getNic() { return nic; }
        public void setNic(String nic) { this.nic = nic; }

        public List<String> getPhoneNumbers() { return phoneNumbers; }
        public void setPhoneNumbers(List<String> phoneNumbers) { this.phoneNumbers = phoneNumbers; }
    }
}
