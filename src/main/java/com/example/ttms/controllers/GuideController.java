// controllers/GuideController.java
package com.example.ttms.controllers;

import com.example.ttms.dto.GuideDTO;
import com.example.ttms.security.AuthUtils;
import com.example.ttms.services.GuideService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guides")
public class GuideController {
    private final GuideService guideService;
    private final AuthUtils auth;

    public GuideController(GuideService guideService, AuthUtils auth) {
        this.guideService = guideService;
        this.auth = auth;
    }

    @GetMapping("/{guideId}")
    @PreAuthorize("hasRole('TOUR_GUIDE')")
    public ResponseEntity<GuideDTO> getGuide(@PathVariable Integer guideId) {
        auth.assertGuideSelf(guideId);
        return ResponseEntity.ok(guideService.getById(guideId));
    }

    @PutMapping("/{guideId}")
    @PreAuthorize("hasRole('TOUR_GUIDE')")
    public ResponseEntity<GuideDTO> update(@PathVariable Integer guideId, @RequestBody GuideDTO dto) {
        auth.assertGuideSelf(guideId);
        return ResponseEntity.ok(guideService.updateProfile(guideId, dto));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('TOUR_GUIDE')")
    public ResponseEntity<GuideDTO> me() {
        Integer id = auth.currentGuideId();
        return ResponseEntity.ok(guideService.getById(id));
    }
}