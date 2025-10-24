-- Create Phone Number Tables for TTMS
-- This script creates the necessary tables for storing phone numbers

-- Create GUIDE_PHONE table
CREATE TABLE GUIDE_PHONE (
    id INT PRIMARY KEY IDENTITY(1,1),
    guideID INT NOT NULL,
    Phone_No VARCHAR(20) NOT NULL,
    FOREIGN KEY (guideID) REFERENCES GUIDE(guideID) ON DELETE CASCADE
);

-- Create CLIENT_PHONE table  
CREATE TABLE CLIENT_PHONE (
    id INT PRIMARY KEY IDENTITY(1,1),
    userID INT NOT NULL,
    Phone_No VARCHAR(20) NOT NULL,
    FOREIGN KEY (userID) REFERENCES CLIENT(userID) ON DELETE CASCADE
);

PRINT 'Phone number tables created successfully!';
