package com.backend.service;

import com.backend.entity.Guide;
import com.backend.entity.enums.GuideStatus;
import com.backend.repository.GuideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GuideService {

    @Autowired
    private GuideRepository repo;

    public List<Guide> getAllGuides() {
        return repo.findAll();
    }

    public Guide addGuide(Guide guide) {
        guide.setStatus(guide.getStatus() == null ? GuideStatus.PENDING : guide.getStatus());
        return repo.save(guide);
    }

    public Guide updateGuide(Long id, Guide guide) {
        Guide existing = repo.findById(id).orElseThrow();
        existing.setFirstName(guide.getFirstName());
        existing.setLastName(guide.getLastName());
        existing.setPhone(guide.getPhone());
        existing.setEmail(guide.getEmail());
        existing.setStatus(guide.getStatus());
        existing.setGender(guide.getGender());
        return repo.save(existing);
    }

    public void deleteGuide(Long id) {
        repo.deleteById(id);
    }
}

