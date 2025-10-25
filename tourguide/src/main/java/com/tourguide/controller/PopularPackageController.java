package com.backend.controller.Analyse;

import com.backend.dto.Analyse.PopularPackageDTO;
import com.backend.service.Analyse.PopularPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class PopularPackageController {

    private final PopularPackageService popularPackageService;

    @GetMapping("/most-popular")
    public ResponseEntity<?> getMostPopularPackage() {
        try {
            PopularPackageDTO popularPackage = popularPackageService.getMostPopularPackage();
            return ResponseEntity.ok(popularPackage);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error fetching popular package: " + e.getMessage());
        }
    }
}