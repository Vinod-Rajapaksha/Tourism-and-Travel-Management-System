package com.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminProfileDto {
    private Long adminID;
    private String fName;
    private String lName;
    private String role;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
    private String passwordMasked;
}