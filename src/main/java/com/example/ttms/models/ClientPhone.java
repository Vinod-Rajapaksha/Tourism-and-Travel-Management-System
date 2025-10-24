package com.example.ttms.models;

import jakarta.persistence.*;

@Entity
@Table(name = "CLIENT_PHONE")
public class ClientPhone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "userID")
    private Integer userID;

    @Column(name = "Phone_No")
    private String phoneNo;

    // Constructors
    public ClientPhone() {}

    public ClientPhone(Integer userID, String phoneNo) {
        this.userID = userID;
        this.phoneNo = phoneNo;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserID() { return userID; }
    public void setUserID(Integer userID) { this.userID = userID; }

    public String getPhoneNo() { return phoneNo; }
    public void setPhoneNo(String phoneNo) { this.phoneNo = phoneNo; }
}
