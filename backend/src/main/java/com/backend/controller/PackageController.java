package com.backend.controller;

import com.backend.entity.Packages;
import com.backend.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/packages")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class PackageController {

    @Autowired
    private PackageRepository packageRepository;

    // READ all packages
    @GetMapping
    public ResponseEntity<List<Packages>> getAllPackages() {
        try {
            List<Packages> packages = packageRepository.findAll();
            System.out.println("Found " + packages.size() + " packages in database");
            return ResponseEntity.ok(packages);
        } catch (Exception e) {
            System.err.println("Error fetching packages: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ one package by ID
    @GetMapping("/{id}")
    public ResponseEntity<Packages> getPackageById(@PathVariable Long id) {
        try {
            Optional<Packages> packageOptional = packageRepository.findById(id);
            if (packageOptional.isPresent()) {
                return ResponseEntity.ok(packageOptional.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error fetching package by ID: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // CREATE new package
    @PostMapping
    public ResponseEntity<Packages> createPackage(@RequestBody Packages pkg) {
        try {
            System.out.println("=== CREATE PACKAGE DEBUG ===");
            System.out.println("Received package: " + pkg);
            System.out.println("Title: " + pkg.getTitle());
            System.out.println("Description: " + pkg.getDescription());
            System.out.println("Price: " + pkg.getPrice());
            System.out.println("Offer: " + pkg.getOffer());
            System.out.println("Status: " + pkg.getStatus());
            System.out.println("Image: " + pkg.getImage());

            // Validation
            if (pkg.getTitle() == null || pkg.getTitle().trim().isEmpty()) {
                System.err.println("Title is required");
                return ResponseEntity.badRequest().build();
            }
            if (pkg.getPrice() == null || pkg.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                System.err.println("Valid price is required");
                return ResponseEntity.badRequest().build();
            }
            if (pkg.getOffer() == null || pkg.getOffer().compareTo(BigDecimal.ZERO) <= 0) {
                System.err.println("Valid offer is required");
                return ResponseEntity.badRequest().build();
            }

            // Ensure ID is null for new entity
            pkg.setPackageID(null);

            // Set default status if not provided
            if (pkg.getStatus() == null || pkg.getStatus().trim().isEmpty()) {
                pkg.setStatus("ACTIVE");
            }

            System.out.println("Attempting to save package...");
            Packages savedPackage = packageRepository.save(pkg);
            System.out.println("Successfully saved package with ID: " + savedPackage.getPackageID());

            return ResponseEntity.status(HttpStatus.CREATED).body(savedPackage);

        } catch (Exception e) {
            System.err.println("Error creating package: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // UPDATE existing package
    @PutMapping("/{id}")
    public ResponseEntity<Packages> updatePackage(@PathVariable Long id, @RequestBody Packages pkg) {
        try {
            System.out.println("=== UPDATE PACKAGE DEBUG ===");
            System.out.println("Updating package ID: " + id);
            System.out.println("Received data: " + pkg);

            Optional<Packages> existingPackageOptional = packageRepository.findById(id);
            if (!existingPackageOptional.isPresent()) {
                System.err.println("Package not found with ID: " + id);
                return ResponseEntity.notFound().build();
            }

            // Validation
            if (pkg.getTitle() == null || pkg.getTitle().trim().isEmpty()) {
                System.err.println("Title is required");
                return ResponseEntity.badRequest().build();
            }
            if (pkg.getPrice() == null || pkg.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                System.err.println("Valid price is required");
                return ResponseEntity.badRequest().build();
            }
            if (pkg.getOffer() != null && pkg.getPrice() != null && pkg.getOffer().compareTo(pkg.getPrice()) <= 0) {
                System.err.println("Valid offer is required");
                return ResponseEntity.badRequest().build();
            }

            // Set the ID to ensure we're updating the correct entity
            pkg.setPackageID(id);

            // Set default status if not provided
            if (pkg.getStatus() == null || pkg.getStatus().trim().isEmpty()) {
                pkg.setStatus("ACTIVE");
            }

            System.out.println("Attempting to update package...");
            Packages updatedPackage = packageRepository.save(pkg);
            System.out.println("Successfully updated package: " + updatedPackage);

            return ResponseEntity.ok(updatedPackage);

        } catch (Exception e) {
            System.err.println("Error updating package: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE package
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Long id) {
        try {
            System.out.println("=== DELETE PACKAGE DEBUG ===");
            System.out.println("Deleting package ID: " + id);

            Optional<Packages> existingPackage = packageRepository.findById(id);
            if (!existingPackage.isPresent()) {
                System.err.println("Package not found with ID: " + id);
                return ResponseEntity.notFound().build();
            }

            packageRepository.deleteById(id);
            System.out.println("Successfully deleted package with ID: " + id);

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            System.err.println("Error deleting package: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Test endpoint to verify connection
    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        try {
            long count = packageRepository.count();
            String message = "Database connection successful! Total packages: " + count;
            System.out.println(message);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            String error = "Database connection failed: " + e.getMessage();
            System.err.println(error);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}