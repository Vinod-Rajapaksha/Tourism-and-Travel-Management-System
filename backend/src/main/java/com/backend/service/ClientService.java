package com.backend.service;

import com.backend.dto.client.*;
import com.backend.entity.Client;
import com.backend.mapper.ClientMapper;
import com.backend.repository.ClientRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository repo;
    private final PasswordEncoder passwordEncoder;

    public Page<ClientResponseDTO> search(String q, int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.asc(
                (sort == null || sort.isBlank()) ? "createdAt" : sort)));
        Page<Client> result = repo.search(q, pageable);
        return result.map(c -> ClientMapper.toDTO(
                c));
    }

    public ClientResponseDTO getById(Long id) {
        Client c = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Client not found"));
        return ClientMapper.toDTO(c);
    }

    @Transactional
    public ClientResponseDTO create(ClientCreateDTO dto) {
        if (repo.existsByEmail(dto.email()))
            throw new IllegalArgumentException("Email already in use");
        if (repo.existsByNic(dto.nic()))
            throw new IllegalArgumentException("NIC already in use");
        String hashed = passwordEncoder.encode(dto.password());
        Client saved = repo.save(ClientMapper.toEntity(dto, hashed));
        return ClientMapper.toDTO(saved);
    }

    @Transactional
    public ClientResponseDTO update(Long id, ClientUpdateDTO dto) {
        Client c = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Client not found"));
        if (!c.getEmail().equals(dto.email()) && repo.existsByEmail(dto.email()))
            throw new IllegalArgumentException("Email already in use");
        if (!c.getNic().equals(dto.nic()) && repo.existsByNic(dto.nic()))
            throw new IllegalArgumentException("NIC already in use");

        ClientMapper.updateEntity(c, dto);
        Client saved = repo.save(c);
        return ClientMapper.toDTO(saved);
    }

    @Transactional
    public void updatePassword(Long id, PasswordUpdateDTO dto) {
        Client c = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Client not found"));
        if (!passwordEncoder.matches(dto.currentPassword(), c.getPassword())) {
            throw new IllegalArgumentException("Current password incorrect");
        }
        c.setPassword(passwordEncoder.encode(dto.newPassword()));
        repo.save(c);
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
