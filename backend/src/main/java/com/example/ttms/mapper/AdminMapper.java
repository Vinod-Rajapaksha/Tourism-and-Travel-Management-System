package com.example.ttms.mapper;

import com.example.ttms.dto.admin.*;
import com.example.ttms.entity.Admin;

import java.time.LocalDateTime;

public class AdminMapper {

    public static Admin toEntity(AdminCreateDTO dto, String encodedPassword) {
        Admin a = new Admin();
        a.setFName(dto.fName());
        a.setLName(dto.lName());
        a.setRole(dto.role());
        a.setEmail(dto.email());
        a.setPassword(encodedPassword);
        a.setPhone(dto.phone());
        a.setCreatedAt(LocalDateTime.now());
        return a;
    }

    public static void updateEntity(Admin a, AdminUpdateDTO dto) {
        a.setFName(dto.fName());
        a.setLName(dto.lName());
        a.setRole(dto.role());
        a.setEmail(dto.email());
        a.setPhone(dto.phone());
    }

    public static AdminResponseDTO toDTO(Admin a) {
        return new AdminResponseDTO(
                a.getAdminID(),
                a.getFName(),
                a.getLName(),
                a.getRole(),
                a.getEmail(),
                a.getPhone(),
                a.getCreatedAt());
    }
}
