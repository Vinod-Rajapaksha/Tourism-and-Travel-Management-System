package com.tourguide.controller;

import com.tourguide.dto.PromotionDTO;
import com.tourguide.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "http://localhost:3000")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    // Get all promotions
    @GetMapping
    public ResponseEntity<List<PromotionDTO>> getAllPromotions() {
        try {
            return ResponseEntity.ok(promotionService.getAllPromotions());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get active promotions
    @GetMapping("/active")
    public ResponseEntity<List<PromotionDTO>> getActivePromotions() {
        try {
            return ResponseEntity.ok(promotionService.getActivePromotions());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get active promotions by specific date
    @GetMapping("/active/date/{date}")
    public ResponseEntity<List<PromotionDTO>> getActivePromotionsByDate(@PathVariable String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            return ResponseEntity.ok(promotionService.getActivePromotionsByDate(localDate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get active promotions in date range
    @GetMapping("/active/range")
    public ResponseEntity<List<PromotionDTO>> getActivePromotionsByDateRange(
            @RequestParam String startDate, @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            return ResponseEntity.ok(promotionService.getActivePromotionsByDateRange(start, end));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Create promotion
    @PostMapping
    public ResponseEntity<PromotionDTO> createPromotion(@RequestBody PromotionDTO dto) {
        try {
            PromotionDTO created = promotionService.createPromotion(dto);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update promotion
    @PutMapping("/{id}")
    public ResponseEntity<PromotionDTO> updatePromotion(@PathVariable Integer id, @RequestBody PromotionDTO dto) {
        try {
            PromotionDTO updated = promotionService.updatePromotion(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Delete promotion
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Integer id) {
        try {
            promotionService.deletePromotion(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get promotion by ID
    @GetMapping("/{id}")
    public ResponseEntity<PromotionDTO> getPromotionById(@PathVariable Integer id) {
        try {
            PromotionDTO promotion = promotionService.getPromotionById(id);
            return ResponseEntity.ok(promotion);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}