package com.backend.controller;

import org.springframework.http.HttpStatus;
import java.util.Map;
import com.backend.entity.Guide;
import com.backend.service.GuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guides")
public class GuideController {

        @Autowired
        private GuideService guideService;

        @GetMapping
        public List<Guide> getAllGuides() {
                return guideService.getAllGuides();
        }

        @PostMapping
        public ResponseEntity<?> addGuide(@RequestBody Guide guide) {
                try {
                        Guide saved = guideService.addGuide(guide);
                        return ResponseEntity.ok(saved);
                } catch (Exception e) {
                        String errorMessage = e.getMessage();

                        // Check if it's a duplicate email error
                        if (errorMessage != null &&
                                        (errorMessage.contains("UQ__Guides__AB6E6164") ||
                                                        errorMessage.toLowerCase().contains("email") ||
                                                        (errorMessage.contains("duplicate key")
                                                                        && errorMessage.toLowerCase().contains("email"))
                                                        ||
                                                        (errorMessage.contains("Duplicate entry") && errorMessage
                                                                        .toLowerCase().contains("email")))) {
                                return ResponseEntity.status(HttpStatus.CONFLICT)
                                                .body(Map.of(
                                                                "error",
                                                                "Email already exists. Please use a different email address.",
                                                                "field", "email"));
                        }

                        // Check if it's a duplicate NIC error
                        if (errorMessage != null &&
                                        (errorMessage.contains("UQ__Guides__")
                                                        && errorMessage.toLowerCase().contains("nic"))
                                        ||
                                        (errorMessage.contains("duplicate key")
                                                        && errorMessage.toLowerCase().contains("nic"))
                                        ||
                                        (errorMessage.contains("Duplicate entry")
                                                        && errorMessage.toLowerCase().contains("nic"))) {
                                return ResponseEntity.status(HttpStatus.CONFLICT)
                                                .body(Map.of(
                                                                "error",
                                                                "NIC already exists. Please use a different NIC.",
                                                                "field", "nic"));
                        }

                        // Other errors
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(Map.of("error", "Failed to create guide: " + errorMessage));
                }
        }

        @PutMapping("/{id}")
        public ResponseEntity<?> updateGuide(@PathVariable Long id, @RequestBody Guide guide) {
                try {
                        Guide updated = guideService.updateGuide(id, guide);
                        return ResponseEntity.ok(updated);
                } catch (Exception e) {
                        String errorMessage = e.getMessage();

                        // Check if it's a duplicate email error
                        if (errorMessage != null &&
                                        (errorMessage.contains("UQ__Guides__AB6E6164") ||
                                                        errorMessage.toLowerCase().contains("email") ||
                                                        (errorMessage.contains("duplicate key")
                                                                        && errorMessage.toLowerCase().contains("email"))
                                                        ||
                                                        (errorMessage.contains("Duplicate entry") && errorMessage
                                                                        .toLowerCase().contains("email")))) {
                                return ResponseEntity.status(HttpStatus.CONFLICT)
                                                .body(Map.of(
                                                                "error",
                                                                "Email already exists. Please use a different email address.",
                                                                "field", "email"));
                        }

                        // Check if it's a duplicate NIC error
                        if (errorMessage != null &&
                                        (errorMessage.contains("UQ__Guides__")
                                                        && errorMessage.toLowerCase().contains("nic"))
                                        ||
                                        (errorMessage.contains("duplicate key")
                                                        && errorMessage.toLowerCase().contains("nic"))
                                        ||
                                        (errorMessage.contains("Duplicate entry")
                                                        && errorMessage.toLowerCase().contains("nic"))) {
                                return ResponseEntity.status(HttpStatus.CONFLICT)
                                                .body(Map.of(
                                                                "error",
                                                                "NIC already exists. Please use a different NIC.",
                                                                "field", "nic"));
                        }

                        // Other errors
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(Map.of("error", "Failed to update guide: " + errorMessage));
                }
        }

        @DeleteMapping("/{id}")
        public void deleteGuide(@PathVariable Long id) {
                guideService.deleteGuide(id);
        }
}
