package com.example.ttms.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminPasswordUpdateDTO(
        @NotBlank String currentPassword,
        @Size(min = 8) @NotBlank String newPassword) {
}
