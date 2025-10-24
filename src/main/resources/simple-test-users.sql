-- Simple Test Users for TTMS
-- Use these credentials to test the application

-- Test Guide User
INSERT INTO GUIDE (guideID, FirstName, LastName, Email, Password, Gender, NIC, Status) VALUES 
(999, 'Test', 'Guide', 'guide1@test.com', '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq', 'Male', '999999999V', 'Available');

-- Test Customer User  
INSERT INTO CLIENT (userID, FirstName, LastName, Email, Password, Gender, NIC) VALUES 
(999, 'Test', 'Customer', 'customer1@test.com', '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq', 'Female', '888888888V');

-- Test Package
INSERT INTO PACKAGE (packageID, Title, Description, Image, Price, Status, Offer) VALUES 
(999, 'Test Package', 'Test tour package for feedback testing', 'test.jpg', 10000.00, 'Active', 0.0);

-- Test Completed Reservation
INSERT INTO RESERVATION (reservationID, startDate, endDate, Status, guideID, userID, packageID) VALUES 
(999, '2024-10-01', '2024-10-03', 'COMPLETED', 999, 999, 999);

PRINT 'Simple test users added!';
