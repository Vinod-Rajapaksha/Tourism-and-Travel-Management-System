// services/GuideService.java
package com.example.ttms.services;

import com.example.ttms.dto.GuideDTO;
import com.example.ttms.models.Guide;
import com.example.ttms.models.GuidePhone;
import com.example.ttms.repositories.GuideRepository;
import com.example.ttms.repositories.GuidePhoneRepository;
import com.example.ttms.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GuideService {
    private final GuideRepository guideRepo;
    private final GuidePhoneRepository guidePhoneRepo;

    public GuideService(GuideRepository guideRepo, GuidePhoneRepository guidePhoneRepo) {
        this.guideRepo = guideRepo;
        this.guidePhoneRepo = guidePhoneRepo;
    }

    public GuideDTO getById(Integer id) {
        Guide g = guideRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guide not found: " + id));
        return toDTO(g);
    }

    public Guide findByEmailOrThrow(String email) {
        return guideRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Guide not found by email"));
    }

    @Transactional
    public GuideDTO updateProfile(Integer id, GuideDTO dto) {
        Guide g = guideRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guide not found: " + id));

        g.setFirstName(dto.getFirstName());
        g.setLastName(dto.getLastName());
        g.setGender(dto.getGender());

        // Update phone numbers
        if (dto.getPhoneNumbers() != null) {
            // Delete existing phone numbers
            guidePhoneRepo.deleteByGuideID(id);
            
            // Add new phone numbers
            for (String phoneNo : dto.getPhoneNumbers()) {
                if (phoneNo != null && !phoneNo.trim().isEmpty()) {
                    GuidePhone phone = new GuidePhone(id, phoneNo.trim());
                    guidePhoneRepo.save(phone);
                }
            }
        }

        return toDTO(guideRepo.save(g));
    }

    public GuideDTO toDTO(Guide g) {
        GuideDTO dto = new GuideDTO();
        dto.setGuideID(g.getGuideID());
        dto.setFirstName(g.getFirstName());
        dto.setLastName(g.getLastName());
        dto.setGender(g.getGender());
        dto.setNic(g.getNic());
        dto.setEmail(g.getEmail());
        dto.setStatus(g.getStatus());
        
        // Get phone numbers
        List<GuidePhone> phones = guidePhoneRepo.findByGuideID(g.getGuideID());
        List<String> phoneNumbers = phones.stream()
                .map(GuidePhone::getPhoneNo)
                .collect(Collectors.toList());
        dto.setPhoneNumbers(phoneNumbers);
        
        return dto;
    }
}