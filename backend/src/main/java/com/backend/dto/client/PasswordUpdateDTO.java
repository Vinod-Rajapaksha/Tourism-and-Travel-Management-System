package com.backend.dto.client;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordUpdateDTO(
        @NotBlank String currentPassword,
        @Size(min = 8) @NotBlank String newPassword) {
}