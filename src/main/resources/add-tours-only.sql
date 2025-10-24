-- Add Sample Tours and Completed Reservations Only
-- This script assumes test users already exist

-- Clear existing sample data first
DELETE FROM RESERVATION WHERE reservationID IN (2001, 2002, 2003);
DELETE FROM PACKAGE WHERE packageID IN (1001, 1002, 1003);

-- Insert Sample Packages
INSERT INTO PACKAGE (packageID, Title, Description, Image, Price, Status, Offer) VALUES 
(1001, 'Colombo City Tour', 'Explore the capital city of Sri Lanka', 'colombo.jpg', 8000.00, 'Active', 5.0),
(1002, 'Kandy Cultural Experience', 'Visit the Temple of the Tooth and cultural sites', 'kandy.jpg', 12000.00, 'Active', 10.0),
(1003, 'Galle Fort Heritage', 'Historical tour of Galle Fort', 'galle.jpg', 15000.00, 'Active', 0.0);

-- Insert Sample Completed Reservations
INSERT INTO RESERVATION (reservationID, startDate, endDate, Status, guideID, userID, packageID) VALUES 
(2001, '2024-10-01', '2024-10-03', 'COMPLETED', 999, 999, 1001),
(2002, '2024-10-05', '2024-10-07', 'COMPLETED', 999, 999, 1002),
(2003, '2024-10-10', '2024-10-12', 'COMPLETED', 999, 999, 1003);

PRINT 'Sample tours and completed reservations added successfully!';
