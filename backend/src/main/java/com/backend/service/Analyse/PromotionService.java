package com.backend.service.Analyse;

import com.backend.dto.Analyse.PromotionDTO;
import com.backend.entity.Promotion;
import com.backend.repository.PromotionRepository;
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

    // --- DTO → Entity (safe parsing)
    private Promotion fromDTO(PromotionDTO dto) {
        Promotion promotion = new Promotion();

        promotion.setTitle(dto.getTitle());
        promotion.setDescription(dto.getDescription());
        promotion.setPromotionType(dto.getPromotionType());
        promotion.setTermsConditions(dto.getTerms());
        promotion.setPromotionColor(dto.getColor());
        promotion.setDiscount(dto.getDiscount());
        promotion.setDuration(dto.getDuration());
        promotion.setMaxParticipants(dto.getMaxParticipants());
        promotion.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        // safe date parsing
        try {
            if (dto.getStartDate() != null && !dto.getStartDate().isBlank()) {
                promotion.setStartDate(LocalDate.parse(dto.getStartDate().substring(0, 10)));
            }
            if (dto.getEndDate() != null && !dto.getEndDate().isBlank()) {
                promotion.setEndDate(LocalDate.parse(dto.getEndDate().substring(0, 10)));
            }
        } catch (Exception e) {
            promotion.setStartDate(null);
            promotion.setEndDate(null);
        }

        // safe time parsing
        try {
            promotion.setTime(dto.getTime() != null && !dto.getTime().isBlank()
                    ? LocalTime.parse(dto.getTime())
                    : null);
        } catch (Exception e) {
            promotion.setTime(null);
        }

        // safe price parsing
        try {
            promotion.setCurrentPrice(dto.getPrice() != null && !dto.getPrice().isBlank()
                    ? new BigDecimal(dto.getPrice())
                    : null);
            promotion.setOriginalPrice(dto.getOriginalPrice() != null && !dto.getOriginalPrice().isBlank()
                    ? new BigDecimal(dto.getOriginalPrice())
                    : null);
        } catch (Exception e) {
            promotion.setCurrentPrice(null);
            promotion.setOriginalPrice(null);
        }

        promotion.setCreatedAt(LocalDateTime.now());
        promotion.setUpdatedAt(LocalDateTime.now());

        return promotion;
    }

    // --- Entity → DTO
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
                promotion.getTermsConditions());
    }

    // --- CRUD ---
    public List<PromotionDTO> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PromotionDTO> getActivePromotions() {
        return promotionRepository.findActivePromotions().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PromotionDTO> getActivePromotionsByDate(LocalDate date) {
        return promotionRepository.findActivePromotionsByDate(date).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PromotionDTO> getActivePromotionsByDateRange(LocalDate start, LocalDate end) {
        return promotionRepository.findActivePromotionsByDateRange(start, end).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PromotionDTO createPromotion(PromotionDTO dto) {
        Promotion promotion = fromDTO(dto);
        Promotion saved = promotionRepository.save(promotion);
        return toDTO(saved);
    }

    @Transactional
    public PromotionDTO updatePromotion(Integer id, PromotionDTO dto) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + id));

        Promotion incoming = fromDTO(dto);

        promotion.setTitle(incoming.getTitle());
        promotion.setDescription(incoming.getDescription());
        promotion.setStartDate(incoming.getStartDate());
        promotion.setEndDate(incoming.getEndDate());
        promotion.setTime(incoming.getTime());
        promotion.setCurrentPrice(incoming.getCurrentPrice());
        promotion.setOriginalPrice(incoming.getOriginalPrice());
        promotion.setDiscount(incoming.getDiscount());
        promotion.setDuration(incoming.getDuration());
        promotion.setMaxParticipants(incoming.getMaxParticipants());
        promotion.setPromotionType(incoming.getPromotionType());
        promotion.setTermsConditions(incoming.getTermsConditions());
        promotion.setPromotionColor(incoming.getPromotionColor());
        promotion.setIsActive(incoming.getIsActive());
        promotion.setUpdatedAt(LocalDateTime.now());

        return toDTO(promotionRepository.save(promotion));
    }

    @Transactional
    public void deletePromotion(Integer id) {
        if (!promotionRepository.existsById(id)) {
            throw new RuntimeException("Promotion not found with id: " + id);
        }
        promotionRepository.deleteById(id);
    }

    public PromotionDTO getPromotionById(Integer id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + id));
        return toDTO(promotion);
    }
}
