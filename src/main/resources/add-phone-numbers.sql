-- Add Phone Numbers for Test Users
-- This script adds sample phone numbers for the test users
-- Run create-phone-tables.sql first if tables don't exist

-- Check if tables exist, if not create them
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GUIDE_PHONE')
BEGIN
    CREATE TABLE GUIDE_PHONE (
        id INT PRIMARY KEY IDENTITY(1,1),
        guideID INT NOT NULL,
        Phone_No VARCHAR(20) NOT NULL,
        FOREIGN KEY (guideID) REFERENCES GUIDE(guideID) ON DELETE CASCADE
    );
    PRINT 'GUIDE_PHONE table created';
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CLIENT_PHONE')
BEGIN
    CREATE TABLE CLIENT_PHONE (
        id INT PRIMARY KEY IDENTITY(1,1),
        userID INT NOT NULL,
        Phone_No VARCHAR(20) NOT NULL,
        FOREIGN KEY (userID) REFERENCES CLIENT(userID) ON DELETE CASCADE
    );
    PRINT 'CLIENT_PHONE table created';
END

-- Add phone numbers for test guides (only if they don't exist)
IF NOT EXISTS (SELECT 1 FROM GUIDE_PHONE WHERE guideID = 101 AND Phone_No = '0711111111')
    INSERT INTO GUIDE_PHONE (guideID, Phone_No) VALUES (101, '0711111111');  -- John Smith (guide1@test.com)

IF NOT EXISTS (SELECT 1 FROM GUIDE_PHONE WHERE guideID = 102 AND Phone_No = '0712222222')
    INSERT INTO GUIDE_PHONE (guideID, Phone_No) VALUES (102, '0712222222');  -- Sarah Johnson (guide2@test.com)

IF NOT EXISTS (SELECT 1 FROM GUIDE_PHONE WHERE guideID = 103 AND Phone_No = '0713333333')
    INSERT INTO GUIDE_PHONE (guideID, Phone_No) VALUES (103, '0713333333');  -- Mike Wilson (guide3@test.com)

-- Add phone numbers for test customers (only if they don't exist)
IF NOT EXISTS (SELECT 1 FROM CLIENT_PHONE WHERE userID = 201 AND Phone_No = '0771111111')
    INSERT INTO CLIENT_PHONE (userID, Phone_No) VALUES (201, '0771111111');  -- Alice Brown (customer1@test.com)

IF NOT EXISTS (SELECT 1 FROM CLIENT_PHONE WHERE userID = 202 AND Phone_No = '0772222222')
    INSERT INTO CLIENT_PHONE (userID, Phone_No) VALUES (202, '0772222222');  -- Bob Davis (customer2@test.com)

IF NOT EXISTS (SELECT 1 FROM CLIENT_PHONE WHERE userID = 203 AND Phone_No = '0773333333')
    INSERT INTO CLIENT_PHONE (userID, Phone_No) VALUES (203, '0773333333');  -- Carol Miller (customer3@test.com)

-- Add additional phone numbers for main test users
IF NOT EXISTS (SELECT 1 FROM GUIDE_PHONE WHERE guideID = 101 AND Phone_No = '0711111112')
    INSERT INTO GUIDE_PHONE (guideID, Phone_No) VALUES (101, '0711111112');  -- John Smith - second phone

IF NOT EXISTS (SELECT 1 FROM CLIENT_PHONE WHERE userID = 201 AND Phone_No = '0771111112')
    INSERT INTO CLIENT_PHONE (userID, Phone_No) VALUES (201, '0771111112');  -- Alice Brown - second phone

PRINT 'Phone numbers added for test users!';
