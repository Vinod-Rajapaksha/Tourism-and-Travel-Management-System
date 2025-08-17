package com.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Feedback")
public class Feedback {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "userID", nullable = false)
    private Client client;

    @ManyToOne(optional = false)
    @JoinColumn(name = "packageID", nullable = false)
    private Package Package;

    @Column(name = "rating", nullable = false)
    private Short rating; // 1..5 (TinyInt)

    @Column(name = "comment", length = 1000)
    private String comment;

    @Column(name = "submittedAt", nullable = false)
    private LocalDateTime submittedAt;

}
