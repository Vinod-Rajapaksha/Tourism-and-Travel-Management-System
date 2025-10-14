package com.backend.entity;

import com.backend.entity.enums.Gender;
import com.backend.entity.enums.GuideStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Guides", indexes = {
        @Index(name = "IX_Guides_Status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Guide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long guideID;

    @Column(name = "fName", nullable = false)
    private String firstName;

    @Column(name = "lName", nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "NIC", unique = true, nullable = false)
    private String nic;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GuideStatus status = GuideStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
