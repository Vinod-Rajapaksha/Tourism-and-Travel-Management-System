package com.backend.dto.client;

import com.backend.entity.enums.Gender;
import jakarta.validation.constraints.*;

public record ClientCreateDTO(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotNull Gender gender,
        @NotBlank String nic,
        @Email @NotBlank String email,
        @Size(min = 8) @NotBlank String password,
        @NotBlank String phone) {
}
