-- Create Test Users for TTMS Application
-- Run this script in your TTMS database

-- Insert Test Guide
INSERT INTO GUIDE (guideID, FirstName, LastName, Email, Password, Gender, NIC, Status) VALUES 
(999, 'Test', 'Guide', 'testguide@test.com', '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq', 'Male', '999999999V', 'Available');

-- Insert Test Customer
INSERT INTO CLIENT (userID, FirstName, LastName, Email, Password, Gender, NIC) VALUES 
(999, 'Test', 'Customer', 'testcustomer@test.com', '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq', 'Male', '888888888V');

-- Insert Test Package
INSERT INTO PACKAGE (packageID, Title, Description, Image, Price, Status, Offer) VALUES 
(999, 'Test Tour', 'Test package for testing', 'test.jpg', 10000.00, 'Active', 0.0);

-- Insert Test Reservation (Completed)
INSERT INTO RESERVATION (reservationID, startDate, endDate, Status, guideID, userID, packageID) VALUES 
(999, '2024-10-01', '2024-10-03', 'COMPLETED', 999, 999, 999);

-- Insert Test Feedback
INSERT INTO FEEDBACK (feedbackID, Rating, Comment, packageID, userID) VALUES 
(999, 5, 'Great test tour!', 999, 999);

-- Insert Guide Phone
INSERT INTO GUIDE_PHONE (guideID, Phone_No) VALUES 
(999, '0719999999');

-- Insert Client Phone
INSERT INTO CLIENT_PHONE (userID, Phone_No) VALUES 
(999, '0779999999');

PRINT 'Test users created successfully!';
