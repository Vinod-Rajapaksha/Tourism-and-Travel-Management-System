package com.backend.controller;

import com.backend.entity.Packages;
import com.backend.service.CustomerService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final CustomerService customerService;

    @GetMapping("/packages")
    public List<Packages> listPackages() {
        return customerService.listActivePackages();
    }

    @GetMapping("/packages/{id}/availability")
    public Map<String, Object> checkAvailability(@PathVariable("id") Long packageId,
                                                 @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
                                                 @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        boolean available = customerService.isPackageAvailable(packageId, start, end);
        return Map.of("packageId", packageId, "start", start, "end", end, "available", available);
    }
}


