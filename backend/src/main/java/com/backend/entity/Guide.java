package com.backend.entity;

import com.backend.entity.enums.Gender;
import com.backend.entity.enums.GuideStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Guides", indexes = {
        @Index(name = "IX_Guides_Status", columnList = "status")
})
public class Guide {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long guideID;

    @Column(name = "fName", length = 100, nullable = false)
    private String firstName;

    @Column(name = "lName", length = 100, nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 16)
    private Gender gender;

    @Column(name = "NIC", length = 20, unique = true)
    private String nic;

    @Column(name = "email", length = 255, nullable = false, unique = true)
    private String email;

    @Column(name = "password", length = 255, nullable = false)
    private String password;

    @Column(name = "phone", length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 16, nullable = false)
    private GuideStatus status;

    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "guide")
    private List<Reservation> reservations;

}
