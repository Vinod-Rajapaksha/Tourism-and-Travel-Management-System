package com.backend.dto.auth;

import com.backend.entity.enums.Gender;
import jakarta.validation.constraints.*;

public record GuideRegisterDTO(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotNull Gender gender,
        @NotBlank String nic,
        @Email @NotBlank String email,
        @Size(min = 8) @NotBlank String password,
        @NotBlank String phone) {
}
