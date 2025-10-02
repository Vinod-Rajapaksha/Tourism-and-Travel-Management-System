package com.tourguide.service;

import com.tourguide.dto.PromotionDTO;
import com.tourguide.entity.Promotion;
import com.tourguide.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    // Convert DTO to Entity
    private Promotion fromDTO(PromotionDTO dto) {
        Promotion promotion = new Promotion();
        promotion.setTitle(dto.getTitle());
        promotion.setStartDate(LocalDate.parse(dto.getStartDate()));
        promotion.setEndDate(LocalDate.parse(dto.getEndDate()));
        promotion.setTime(dto.getTime() != null ? LocalTime.parse(dto.getTime()) : null);
        promotion.setDescription(dto.getDescription());
        promotion.setCurrentPrice(dto.getPrice() != null ? new BigDecimal(dto.getPrice()) : null);
        promotion.setOriginalPrice(dto.getOriginalPrice() != null ? new BigDecimal(dto.getOriginalPrice()) : null);
        promotion.setDiscount(dto.getDiscount());
        promotion.setDuration(dto.getDuration());
        promotion.setMaxParticipants(dto.getMaxParticipants());
        promotion.setPromotionType(dto.getPromotionType());
        promotion.setTermsConditions(dto.getTerms());
        promotion.setPromotionColor(dto.getColor());
        promotion.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        promotion.setCreatedAt(LocalDateTime.now());
        promotion.setUpdatedAt(LocalDateTime.now());
        return promotion;
    }

    // Convert Entity to DTO
    private PromotionDTO toDTO(Promotion promotion) {
        return new PromotionDTO(
                promotion.getPromotionId(),
                promotion.getTitle(),
                promotion.getStartDate() != null ? promotion.getStartDate().toString() : null,
                promotion.getEndDate() != null ? promotion.getEndDate().toString() : null,
                promotion.getPromotionColor(),
                promotion.getDescription(),
                promotion.getTime() != null ? promotion.getTime().toString() : null,
                promotion.getCurrentPrice() != null ? promotion.getCurrentPrice().toString() : null,
                promotion.getOriginalPrice() != null ? promotion.getOriginalPrice().toString() : null,
                promotion.getDiscount(),
                promotion.getDuration(),
                promotion.getMaxParticipants(),
                promotion.getIsActive(),
                promotion.getPromotionType(),
                promotion.getTermsConditions()
        );
    }

    // Get all promotions
    public List<PromotionDTO> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Get active promotions
    public List<PromotionDTO> getActivePromotions() {
        return promotionRepository.findActivePromotions().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Get active promotions by specific date
    public List<PromotionDTO> getActivePromotionsByDate(LocalDate date) {
        return promotionRepository.findActivePromotionsByDate(date)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Get active promotions within a date range
    public List<PromotionDTO> getActivePromotionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return promotionRepository.findActivePromotionsByDateRange(startDate, endDate)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Create promotion
    public PromotionDTO createPromotion(PromotionDTO dto) {
        Promotion promotion = fromDTO(dto);
        Promotion saved = promotionRepository.save(promotion);
        return toDTO(saved);
    }

    // Update promotion
    @Transactional
    public PromotionDTO updatePromotion(Integer id, PromotionDTO dto) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + id));

        // Update fields
        promotion.setTitle(dto.getTitle());
        promotion.setStartDate(dto.getStartDate() != null ? LocalDate.parse(dto.getStartDate()) : promotion.getStartDate());
        promotion.setEndDate(dto.getEndDate() != null ? LocalDate.parse(dto.getEndDate()) : promotion.getEndDate());
        promotion.setTime(dto.getTime() != null ? LocalTime.parse(dto.getTime()) : promotion.getTime());
        promotion.setDescription(dto.getDescription());
        promotion.setCurrentPrice(dto.getPrice() != null ? new BigDecimal(dto.getPrice()) : promotion.getCurrentPrice());
        promotion.setOriginalPrice(dto.getOriginalPrice() != null ? new BigDecimal(dto.getOriginalPrice()) : promotion.getOriginalPrice());
        promotion.setDiscount(dto.getDiscount());
        promotion.setDuration(dto.getDuration());
        promotion.setMaxParticipants(dto.getMaxParticipants());
        promotion.setPromotionType(dto.getPromotionType());
        promotion.setTermsConditions(dto.getTerms());
        promotion.setPromotionColor(dto.getColor());
        promotion.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : promotion.getIsActive());
        promotion.setUpdatedAt(LocalDateTime.now());

        Promotion updated = promotionRepository.save(promotion);
        return toDTO(updated);
    }

    // Delete promotion
    @Transactional
    public void deletePromotion(Integer id) {
        if (!promotionRepository.existsById(id)) {
            throw new RuntimeException("Promotion not found with id: " + id);
        }
        promotionRepository.deleteById(id);
    }

    // Get promotion by ID
    public PromotionDTO getPromotionById(Integer id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + id));
        return toDTO(promotion);
    }
}
