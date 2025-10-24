package com.backend.entity;

import com.backend.entity.enums.Gender;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Client", indexes = {
        @Index(name = "IX_User_Email", columnList = "email")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userID;

    @Column(name = "fName")
    private String firstName;

    @Column(name = "lName")
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "NIC", unique = true)
    private String nic;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "phone")
    private String phone;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "client")
    @JsonIgnore
    private List<Reservation> reservations;

    @OneToMany(mappedBy = "client")
    @JsonIgnore
    private List<Payment> payments;

}
