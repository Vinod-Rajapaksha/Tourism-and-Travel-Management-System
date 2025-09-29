package com.backend.controller;

import com.backend.dto.dashboard.DashboardResponseDTO;
import com.backend.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager/dashboard")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService service;

    @GetMapping
    public ResponseEntity<DashboardResponseDTO> getDashboard(
            Authentication authentication,
            @RequestParam(defaultValue = "8") int months,
            @RequestParam(name = "recent", defaultValue = "7") int recentLimit,
            @RequestParam(defaultValue = "90") int activeDays,
            @RequestParam(defaultValue = "6") int packageMonths,
            @RequestParam(defaultValue = "5") int packageLimit) {
        return ResponseEntity.ok(
                service.getDashboard(authentication, months, recentLimit, activeDays, packageMonths, packageLimit));
    }
}
