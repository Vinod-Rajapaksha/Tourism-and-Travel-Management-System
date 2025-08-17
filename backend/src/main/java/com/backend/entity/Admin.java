package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminID;

    private String fName;
    private String lName;
    private String role;

    @Column(unique = true)
    private String email;
    private String password;
    private String phone;
    private LocalDateTime createdAt = LocalDateTime.now();
}