package com.backend.entity;

import com.backend.entity.enums.Gender;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Client", indexes = {
        @Index(name = "IX_User_Email", columnList = "email")
})
public class Client {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userID;

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

    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "client")
    private List<Reservation> reservations;

    @OneToMany(mappedBy = "client")
    private List<Payment> payments;

}
