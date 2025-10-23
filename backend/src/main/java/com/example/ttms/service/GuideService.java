package com.example.ttms.service;

import com.example.ttms.entity.Guide;
import com.example.ttms.repo.GuideRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GuideService {
    private final GuideRepository guideRepository;

    public GuideService(GuideRepository guideRepository) {
        this.guideRepository = guideRepository;
    }

    public List<Guide> getAllGuides() {
        return guideRepository.findAll();
    }
}
