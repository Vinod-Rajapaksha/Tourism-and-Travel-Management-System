-- Add Sample Tours and Completed Reservations for Testing (Fixed Version)
-- This script handles existing data properly

-- Clear existing sample data first
DELETE FROM RESERVATION WHERE reservationID IN (2001, 2002, 2003);
DELETE FROM PACKAGE WHERE packageID IN (1001, 1002, 1003);

-- Insert Sample Packages (only if they don't exist)
IF NOT EXISTS (SELECT 1 FROM PACKAGE WHERE packageID = 1001)
BEGIN
    INSERT INTO PACKAGE (packageID, Title, Description, Image, Price, Status, Offer) VALUES 
    (1001, 'Colombo City Tour', 'Explore the capital city of Sri Lanka', 'colombo.jpg', 8000.00, 'Active', 5.0);
END

IF NOT EXISTS (SELECT 1 FROM PACKAGE WHERE packageID = 1002)
BEGIN
    INSERT INTO PACKAGE (packageID, Title, Description, Image, Price, Status, Offer) VALUES 
    (1002, 'Kandy Cultural Experience', 'Visit the Temple of the Tooth and cultural sites', 'kandy.jpg', 12000.00, 'Active', 10.0);
END

IF NOT EXISTS (SELECT 1 FROM PACKAGE WHERE packageID = 1003)
BEGIN
    INSERT INTO PACKAGE (packageID, Title, Description, Image, Price, Status, Offer) VALUES 
    (1003, 'Galle Fort Heritage', 'Historical tour of Galle Fort', 'galle.jpg', 15000.00, 'Active', 0.0);
END

-- Insert Sample Completed Reservations (only if they don't exist)
IF NOT EXISTS (SELECT 1 FROM RESERVATION WHERE reservationID = 2001)
BEGIN
    INSERT INTO RESERVATION (reservationID, startDate, endDate, Status, guideID, userID, packageID) VALUES 
    (2001, '2024-10-01', '2024-10-03', 'COMPLETED', 999, 999, 1001);
END

IF NOT EXISTS (SELECT 1 FROM RESERVATION WHERE reservationID = 2002)
BEGIN
    INSERT INTO RESERVATION (reservationID, startDate, endDate, Status, guideID, userID, packageID) VALUES 
    (2002, '2024-10-05', '2024-10-07', 'COMPLETED', 999, 999, 1002);
END

IF NOT EXISTS (SELECT 1 FROM RESERVATION WHERE reservationID = 2003)
BEGIN
    INSERT INTO RESERVATION (reservationID, startDate, endDate, Status, guideID, userID, packageID) VALUES 
    (2003, '2024-10-10', '2024-10-12', 'COMPLETED', 999, 999, 1003);
END

PRINT 'Sample tours and completed reservations added successfully!';
