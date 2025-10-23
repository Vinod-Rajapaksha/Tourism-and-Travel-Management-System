package com.example.ttms.controller;

import org.springframework.web.bind.annotation.*;
import com.example.ttms.service.GuideService;
import com.example.ttms.entity.Guide;
import java.util.*;

@RestController
@RequestMapping("/api/guides")
@CrossOrigin(origins = "*")
public class GuideController {
    private final GuideService guideService;

    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    @GetMapping
    public List<Guide> getAllGuides() {  // ✅ Change return type to Guide (or use DTO if needed)
        return guideService.getAllGuides();  // Real data now
    }
}

