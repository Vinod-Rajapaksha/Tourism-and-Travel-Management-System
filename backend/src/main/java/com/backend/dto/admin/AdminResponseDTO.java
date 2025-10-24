package com.backend.dto.admin;

import java.time.LocalDateTime;

public record AdminResponseDTO(
                Long adminID,
                String fName,
                String lName,
                String role,
                String email,
                String phone,
                LocalDateTime createdAt) {
}