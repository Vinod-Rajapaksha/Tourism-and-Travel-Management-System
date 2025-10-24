package com.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "userID")
    private Client client;

    @ManyToOne(optional = false)
    @JoinColumn(name = "packageID")
    private Packages packages;

    @Column(name = "rating")
    private Short rating;

    @Column(name = "comment")
    private String comment;

    @Column(name = "submittedAt")
    private LocalDateTime submittedAt;

}
