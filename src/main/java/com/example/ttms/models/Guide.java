// models/Guide.java
package com.example.ttms.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "GUIDE")
public class Guide {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer guideID;

    @Column(name = "FirstName")
    private String firstName;

    @Column(name = "LastName")
    private String lastName;

    @Column(name = "Email", unique = true)
    private String email;

    @Column(name = "Password")
    private String password;

    @Column(name = "Gender")
    private String gender;

    @Column(name = "NIC", unique = true)
    private String nic;

    @Column(name = "Status")
    private String status;

    @OneToMany(mappedBy = "guideID", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GuidePhone> phoneNumbers;

    public Integer getGuideID() { return guideID; }
    public void setGuideID(Integer guideID) { this.guideID = guideID; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getNic() { return nic; }
    public void setNic(String nic) { this.nic = nic; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<GuidePhone> getPhoneNumbers() { return phoneNumbers; }
    public void setPhoneNumbers(List<GuidePhone> phoneNumbers) { this.phoneNumbers = phoneNumbers; }
}