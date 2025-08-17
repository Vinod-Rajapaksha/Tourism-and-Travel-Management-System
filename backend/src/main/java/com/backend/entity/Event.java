package com.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Event")
public class Event {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventID;

    @Column(name = "title", length = 150, nullable = false)
    private String title;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "details", length = 1000)
    private String details;

    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

}
