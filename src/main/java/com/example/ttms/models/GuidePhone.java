package com.example.ttms.models;

import jakarta.persistence.*;

@Entity
@Table(name = "GUIDE_PHONE")
public class GuidePhone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "guideID")
    private Integer guideID;

    @Column(name = "Phone_No")
    private String phoneNo;

    // Constructors
    public GuidePhone() {}

    public GuidePhone(Integer guideID, String phoneNo) {
        this.guideID = guideID;
        this.phoneNo = phoneNo;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getGuideID() { return guideID; }
    public void setGuideID(Integer guideID) { this.guideID = guideID; }

    public String getPhoneNo() { return phoneNo; }
    public void setPhoneNo(String phoneNo) { this.phoneNo = phoneNo; }
}
