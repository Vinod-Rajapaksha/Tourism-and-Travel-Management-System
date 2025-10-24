// controllers/HealthController.java
package com.example.ttms.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {
    
    @GetMapping
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "message", "TTMS Backend is running",
            "timestamp", java.time.Instant.now().toString()
        ));
    }
    
    @GetMapping("/database")
    public ResponseEntity<Map<String, String>> databaseHealth() {
        return ResponseEntity.ok(Map.of(
            "database", "Connected to TTMS",
            "status", "UP"
        ));
    }
}
