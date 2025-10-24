package com.backend.dto;

import com.backend.entity.enums.Gender;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRegistrationDTO {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private String nic;
    private Gender gender;
}
