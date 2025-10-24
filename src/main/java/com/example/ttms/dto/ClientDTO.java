package com.example.ttms.dto;

import java.util.List;

public class ClientDTO {
    private Integer userID;
    private String firstName;
    private String lastName;
    private String gender;
    private String nic;
    private String email;
    private List<String> phoneNumbers;

    public Integer getUserID() { return userID; }
    public void setUserID(Integer userID) { this.userID = userID; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getNic() { return nic; }
    public void setNic(String nic) { this.nic = nic; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<String> getPhoneNumbers() { return phoneNumbers; }
    public void setPhoneNumbers(List<String> phoneNumbers) { this.phoneNumbers = phoneNumbers; }
}
