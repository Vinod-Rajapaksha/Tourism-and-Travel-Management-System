package com.backend.mapper;

import com.backend.dto.client.*;
import com.backend.entity.Client;

import java.time.LocalDateTime;

public class ClientMapper {

    public static Client toEntity(ClientCreateDTO dto, String encodedPassword) {
        Client c = new Client();
        c.setFirstName(dto.firstName());
        c.setLastName(dto.lastName());
        c.setGender(dto.gender());
        c.setNic(dto.nic());
        c.setEmail(dto.email());
        c.setPassword(encodedPassword);
        c.setPhone(dto.phone());
        c.setCreatedAt(LocalDateTime.now());
        return c;
    }

    public static void updateEntity(Client c, ClientUpdateDTO dto) {
        c.setFirstName(dto.firstName());
        c.setLastName(dto.lastName());
        c.setGender(dto.gender());
        c.setNic(dto.nic());
        c.setEmail(dto.email());
        c.setPhone(dto.phone());
    }

    public static ClientResponseDTO toDTO(Client c) {
        return new ClientResponseDTO(
                c.getUserID(),
                c.getFirstName(),
                c.getLastName(),
                c.getGender(),
                c.getNic(),
                c.getEmail(),
                c.getPhone(),
                c.getCreatedAt());
    }
}
