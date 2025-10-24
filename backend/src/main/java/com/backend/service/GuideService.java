package com.backend.service;

import com.backend.entity.Guide;
import com.backend.entity.enums.GuideStatus;
import com.backend.repository.GuideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class GuideService {

    @Autowired
    private GuideRepository repo;

    public List<Guide> getAllGuides() {
        return repo.findAll();
    }

    public Guide addGuide(Guide g) {
        if (repo.existsByEmailIgnoreCase(g.getEmail()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        if (repo.existsByNic(g.getNic()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "NIC already exists");

        g.setStatus(g.getStatus() == null ? GuideStatus.PENDING : g.getStatus());
        return repo.save(g);
    }

    public Guide updateGuide(Long id, Guide g) {
        var existing = repo.findById(id).orElseThrow();

        if (repo.existsByEmailIgnoreCaseAndGuideIDNot(g.getEmail(), id))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        if (repo.existsByNicAndGuideIDNot(g.getNic(), id))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "NIC already exists");

        existing.setFirstName(g.getFirstName());
        existing.setLastName(g.getLastName());
        existing.setPhone(g.getPhone());
        existing.setEmail(g.getEmail());
        existing.setGender(g.getGender());
        existing.setNic(g.getNic());
        existing.setStatus(g.getStatus());
        if (g.getPassword() != null && !g.getPassword().isBlank()) {
            existing.setPassword(g.getPassword());
        }
        return repo.save(existing);
    }

    public void deleteGuide(Long id) {
        repo.deleteById(id);
    }
}
