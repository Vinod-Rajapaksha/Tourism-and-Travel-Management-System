package com.backend.dto.admin;

import jakarta.validation.constraints.*;

public record AdminCreateDTO(
        @NotBlank String fName,
        @NotBlank String lName,
        @NotNull String role,
        @Email @NotBlank String email,
        @Size(min = 8) @NotBlank String password,
        @NotBlank String phone) {
}
