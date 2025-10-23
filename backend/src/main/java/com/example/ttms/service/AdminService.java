package com.example.ttms.service;

import com.example.ttms.dto.admin.*;
import com.example.ttms.entity.Admin;
import com.example.ttms.mapper.AdminMapper;
import com.example.ttms.repo.AdminRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository repo;
    private final PasswordEncoder passwordEncoder;

    public Page<AdminResponseDTO> search(String q, int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.asc(
                (sort == null || sort.isBlank()) ? "createdAt" : sort)));
        Page<Admin> result = repo.search(q, pageable);
        return result.map(a -> AdminMapper.toDTO(a));
    }

    public AdminResponseDTO getById(Long id) {
        Admin a = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Admin not found"));
        return AdminMapper.toDTO(a);
    }

    @Transactional
    public AdminResponseDTO create(AdminCreateDTO dto) {
        if (repo.existsByEmail(dto.email()))
            throw new IllegalArgumentException("Email already in use");
        String hashed = passwordEncoder.encode(dto.password());
        Admin saved = repo.save(AdminMapper.toEntity(dto, hashed));
        return AdminMapper.toDTO(saved);
    }

    @Transactional
    public AdminResponseDTO update(Long id, AdminUpdateDTO dto) {
        Admin a = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Admin not found"));
        if (!a.getEmail().equals(dto.email()) && repo.existsByEmail(dto.email()))
            throw new IllegalArgumentException("Email already in use");

        AdminMapper.updateEntity(a, dto);
        Admin saved = repo.save(a);
        return AdminMapper.toDTO(saved);
    }

    @Transactional
    public void updatePassword(Long id, AdminPasswordUpdateDTO dto) {
        Admin a = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Admin not found"));
        if (!passwordEncoder.matches(dto.currentPassword(), a.getPassword())) {
            throw new IllegalArgumentException("Current password incorrect");
        }
        a.setPassword(passwordEncoder.encode(dto.newPassword()));
        repo.save(a);
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
