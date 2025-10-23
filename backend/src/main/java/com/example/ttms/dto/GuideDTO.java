package com.example.ttms.dto;

public class GuideDTO {
    private Long guideID;
    private String fName;
    private String lName;
    private String email;
    private String phone;

    public Long getGuideID() { return guideID; }
    public void setGuideID(Long guideID) { this.guideID = guideID; }

    public String getfName() { return fName; }
    public void setfName(String fName) { this.fName = fName; }

    public String getlName() { return lName; }
    public void setlName(String lName) { this.lName = lName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}

