package com.backend.controller;

import com.backend.dto.admin.*;
import com.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/adminmanagement")
@RequiredArgsConstructor
public class AdminManagementController {

    private final AdminService service;

    @GetMapping
    public Page<AdminResponseDTO> list(
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "createdAt") String sort) {
        return service.search(q, page, size, sort);
    }

    @GetMapping("/{id}")
    public AdminResponseDTO get(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<AdminResponseDTO> create(@Valid @RequestBody AdminCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public AdminResponseDTO update(@PathVariable Long id, @Valid @RequestBody AdminUpdateDTO dto) {
        return service.update(id, dto);
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(@PathVariable Long id, @Valid @RequestBody AdminPasswordUpdateDTO dto) {
        service.updatePassword(id, dto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
