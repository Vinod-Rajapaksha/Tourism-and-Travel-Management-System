-- Quick Sample Data for Testing Feedback System
-- Run this in your TTMS database

-- Ensure test users exist
INSERT INTO GUIDE (guideID, FirstName, LastName, Email, Password, Gender, NIC, Status) VALUES 
(999, 'Test', 'Guide', 'guide1@test.com', '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq', 'Male', '999999999V', 'Available');

INSERT INTO CLIENT (userID, FirstName, LastName, Email, Password, Gender, NIC) VALUES 
(999, 'Test', 'Customer', 'customer1@test.com', '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq', 'Female', '888888888V');

-- Add sample packages
INSERT INTO PACKAGE (packageID, Title, Description, Image, Price, Status, Offer) VALUES 
(1001, 'Colombo City Tour', 'Explore the capital city of Sri Lanka', 'colombo.jpg', 8000.00, 'Active', 5.0),
(1002, 'Kandy Cultural Experience', 'Visit the Temple of the Tooth and cultural sites', 'kandy.jpg', 12000.00, 'Active', 10.0),
(1003, 'Galle Fort Heritage', 'Historical tour of Galle Fort', 'galle.jpg', 15000.00, 'Active', 0.0);

-- Add completed reservations
INSERT INTO RESERVATION (reservationID, startDate, endDate, Status, guideID, userID, packageID) VALUES 
(2001, '2024-10-01', '2024-10-03', 'COMPLETED', 999, 999, 1001),
(2002, '2024-10-05', '2024-10-07', 'COMPLETED', 999, 999, 1002),
(2003, '2024-10-10', '2024-10-12', 'COMPLETED', 999, 999, 1003);

PRINT 'All sample data added successfully!';
