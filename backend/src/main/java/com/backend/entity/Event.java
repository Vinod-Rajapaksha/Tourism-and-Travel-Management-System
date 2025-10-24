package com.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Event")
public class Event {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventID;

    @Column(name = "title")
    private String title;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "details")
    private String details;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

}
