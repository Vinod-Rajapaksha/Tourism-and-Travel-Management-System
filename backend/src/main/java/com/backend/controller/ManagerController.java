package com.backend.controller;

import com.backend.dto.ManagerDashboardDTO;
import com.backend.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager/dashboard")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    @GetMapping("/stats")
    public ManagerDashboardDTO getStats() {
        return managerService.getDashboardStats();
    }
}
