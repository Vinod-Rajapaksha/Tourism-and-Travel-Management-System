package com.example.ttms.dto.admin;

import jakarta.validation.constraints.*;

public record AdminUpdateDTO(
        @NotBlank String fName,
        @NotBlank String lName,
        @NotBlank String role,
        @Email @NotBlank String email,
        @NotBlank String phone) {
}