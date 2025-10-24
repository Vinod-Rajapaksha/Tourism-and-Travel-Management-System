-- Test Data for TTMS Application
-- Run this script to add test users for both guides and customers

-- Insert Test Guide Data
INSERT INTO GUIDE (guideID, FirstName, LastName, Email, Password, Gender, NIC, Status) VALUES 
(101, 'John', 'Smith', 'guide1@test.com', '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq', 'Male', '901234567V', 'Available'),
(102, 'Sarah', 'Johnson', 'guide2@test.com', '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq', 'Female', '902345678V', 'Available'),
(103, 'Mike', 'Wilson', 'guide3@test.com', '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq', 'Male', '903345678V', 'Busy');

-- Insert Test Customer Data
INSERT INTO CLIENT (userID, FirstName, LastName, Email, Password, Gender, NIC) VALUES 
(201, 'Alice', 'Brown', 'customer1@test.com', '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq', 'Female', '801234567V'),
(202, 'Bob', 'Davis', 'customer2@test.com', '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq', 'Male', '802345678V'),
(203, 'Carol', 'Miller', 'customer3@test.com', '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq', 'Female', '803345678V');

-- Insert Test Package Data (if not already exists)
INSERT INTO PACKAGE (packageID, Title, Description, Image, Price, Status, Offer) VALUES 
(101, 'Colombo City Tour', 'Explore the capital city of Sri Lanka', 'colombo.jpg', 8000.00, 'Active', 5.0),
(102, 'Kandy Cultural Experience', 'Visit the Temple of the Tooth and cultural sites', 'kandy.jpg', 12000.00, 'Active', 10.0),
(103, 'Galle Fort Heritage', 'Historical tour of Galle Fort', 'galle.jpg', 15000.00, 'Active', 0.0);

-- Insert Test Reservations (Completed for feedback testing)
INSERT INTO RESERVATION (reservationID, startDate, endDate, Status, guideID, userID, packageID) VALUES 
(201, '2024-10-01', '2024-10-03', 'COMPLETED', 101, 201, 101),
(202, '2024-10-05', '2024-10-07', 'COMPLETED', 102, 202, 102),
(203, '2024-10-10', '2024-10-12', 'COMPLETED', 103, 203, 103);

-- Insert Test Feedback (for testing feedback management)
INSERT INTO FEEDBACK (feedbackID, Rating, Comment, packageID, userID) VALUES 
(201, 5, 'Excellent tour guide and amazing experience!', 101, 201),
(202, 4, 'Good tour, would recommend to others.', 102, 202);

-- Insert Guide Phone Numbers
INSERT INTO GUIDE_PHONE (guideID, Phone_No) VALUES 
(101, '0711111111'),
(102, '0712222222'),
(103, '0713333333');

-- Insert Client Phone Numbers
INSERT INTO CLIENT_PHONE (userID, Phone_No) VALUES 
(201, '0771111111'),
(202, '0772222222'),
(203, '0773333333');
