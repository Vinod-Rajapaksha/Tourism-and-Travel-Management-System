package com.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerProfileDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String nic;
    private String gender;
    private String createdAt;
}
