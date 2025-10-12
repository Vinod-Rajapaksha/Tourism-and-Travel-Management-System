package com.backend.controller;

import com.backend.entity.Guide;
import com.backend.service.GuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guides")
@CrossOrigin(origins = "http://localhost:5173")
public class GuideController {

    @Autowired
    private GuideService guideService;

    @GetMapping
    public List<Guide> getAllGuides() {
        return guideService.getAllGuides();
    }

    @PostMapping
    public Guide addGuide(@RequestBody Guide guide) {
        return guideService.addGuide(guide);
    }

    @PutMapping("/{id}")
    public Guide updateGuide(@PathVariable Long id, @RequestBody Guide guide) {
        return guideService.updateGuide(id, guide);
    }

    @DeleteMapping("/{id}")
    public void deleteGuide(@PathVariable Long id) {
        guideService.deleteGuide(id);
    }
}
