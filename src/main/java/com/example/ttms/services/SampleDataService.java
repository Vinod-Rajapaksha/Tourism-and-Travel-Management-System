package com.example.ttms.services;

import com.example.ttms.models.Client;
import com.example.ttms.models.Guide;
import com.example.ttms.models.PackageEntity;
import com.example.ttms.models.Reservation;
import com.example.ttms.repositories.ClientRepository;
import com.example.ttms.repositories.GuideRepository;
import com.example.ttms.repositories.PackageRepository;
import com.example.ttms.repositories.ReservationRepository;
import com.example.ttms.config.SampleDataConfig;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class SampleDataService {
    
    private final ReservationRepository reservationRepository;
    private final GuideRepository guideRepository;
    private final ClientRepository clientRepository;
    private final PackageRepository packageRepository;
    private final SampleDataConfig config;
    private final Random random = new Random();
    
    public SampleDataService(
            ReservationRepository reservationRepository,
            GuideRepository guideRepository,
            ClientRepository clientRepository,
            PackageRepository packageRepository,
            SampleDataConfig config) {
        this.reservationRepository = reservationRepository;
        this.guideRepository = guideRepository;
        this.clientRepository = clientRepository;
        this.packageRepository = packageRepository;
        this.config = config;
    }
    
    @Transactional
    public void addSampleCompletedToursForNewCustomer(Client client) {
        if (!config.isEnabled()) {
            return; // Sample data generation is disabled
        }
        
        try {
            // Get available guides
            List<Guide> availableGuides = guideRepository.findAll();
            if (availableGuides.isEmpty()) {
                return; // No guides available
            }
            
            // Get available packages
            List<PackageEntity> availablePackages = packageRepository.findAll();
            if (availablePackages.isEmpty()) {
                return; // No packages available
            }
            
            // Add sample completed tours based on configuration
            int numberOfTours = config.getMinToursPerCustomer() + 
                               random.nextInt(config.getMaxToursPerCustomer() - config.getMinToursPerCustomer() + 1);
            
            for (int i = 0; i < numberOfTours; i++) {
                // Select random guide and package
                Guide randomGuide = availableGuides.get(random.nextInt(availableGuides.size()));
                PackageEntity randomPackage = availablePackages.get(random.nextInt(availablePackages.size()));
                
                // Create completion date based on configuration
                int daysAgo = config.getMinDaysAgo() + random.nextInt(config.getMaxDaysAgo() - config.getMinDaysAgo() + 1);
                LocalDate endDate = LocalDate.now().minusDays(daysAgo);
                LocalDate startDate = endDate.minusDays(2 + random.nextInt(3)); // 2-4 day tours
                
                // Create reservation
                Reservation reservation = new Reservation();
                reservation.setClient(client);
                reservation.setGuide(randomGuide);
                reservation.setPack(randomPackage);
                reservation.setStartDate(startDate);
                reservation.setEndDate(endDate);
                reservation.setStatus("COMPLETED");
                
                reservationRepository.save(reservation);
            }
            
            System.out.println("Added " + numberOfTours + " sample completed tours for new customer: " + client.getEmail());
            
        } catch (Exception e) {
            // Log error but don't fail registration
            System.err.println("Failed to add sample tours for customer " + client.getEmail() + ": " + e.getMessage());
        }
    }
    
    @Transactional
    public void addSampleCompletedToursForNewGuide(Guide guide) {
        if (!config.isEnabled()) {
            return; // Sample data generation is disabled
        }
        
        try {
            // Get available customers
            List<Client> availableCustomers = clientRepository.findAll();
            if (availableCustomers.isEmpty()) {
                return; // No customers available
            }
            
            // Get available packages
            List<PackageEntity> availablePackages = packageRepository.findAll();
            if (availablePackages.isEmpty()) {
                return; // No packages available
            }
            
            // Add sample completed tours based on configuration
            int numberOfTours = config.getMinToursPerGuide() + 
                               random.nextInt(config.getMaxToursPerGuide() - config.getMinToursPerGuide() + 1);
            
            for (int i = 0; i < numberOfTours; i++) {
                // Select random customer and package
                Client randomCustomer = availableCustomers.get(random.nextInt(availableCustomers.size()));
                PackageEntity randomPackage = availablePackages.get(random.nextInt(availablePackages.size()));
                
                // Create completion date based on configuration
                int daysAgo = config.getMinDaysAgo() + random.nextInt(config.getMaxDaysAgo() - config.getMinDaysAgo() + 1);
                LocalDate endDate = LocalDate.now().minusDays(daysAgo);
                LocalDate startDate = endDate.minusDays(2 + random.nextInt(3)); // 2-4 day tours
                
                // Create reservation
                Reservation reservation = new Reservation();
                reservation.setClient(randomCustomer);
                reservation.setGuide(guide);
                reservation.setPack(randomPackage);
                reservation.setStartDate(startDate);
                reservation.setEndDate(endDate);
                reservation.setStatus("COMPLETED");
                
                reservationRepository.save(reservation);
            }
            
            System.out.println("Added " + numberOfTours + " sample completed tours for new guide: " + guide.getEmail());
            
        } catch (Exception e) {
            // Log error but don't fail registration
            System.err.println("Failed to add sample tours for guide " + guide.getEmail() + ": " + e.getMessage());
        }
    }
}
