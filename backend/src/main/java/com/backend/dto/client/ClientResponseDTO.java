package com.backend.dto.client;

import com.backend.entity.enums.Gender;
import java.time.LocalDateTime;

public record ClientResponseDTO(
        Long userID,
        String firstName,
        String lastName,
        Gender gender,
        String nic,
        String email,
        String phone,
        LocalDateTime createdAt) {
}