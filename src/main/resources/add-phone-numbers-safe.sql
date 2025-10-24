-- Add Phone Numbers for Test Users (Safe Version)
-- This script works with existing user IDs in the database

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

-- Add phone numbers for guide1@test.com (find the actual ID)
DECLARE @guide1Id INT;
SELECT @guide1Id = guideID FROM GUIDE WHERE Email = 'guide1@test.com';
IF @guide1Id IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM GUIDE_PHONE WHERE guideID = @guide1Id AND Phone_No = '0711111111')
        INSERT INTO GUIDE_PHONE (guideID, Phone_No) VALUES (@guide1Id, '0711111111');
    IF NOT EXISTS (SELECT 1 FROM GUIDE_PHONE WHERE guideID = @guide1Id AND Phone_No = '0711111112')
        INSERT INTO GUIDE_PHONE (guideID, Phone_No) VALUES (@guide1Id, '0711111112');
    PRINT 'Phone numbers added for guide1@test.com (ID: ' + CAST(@guide1Id AS VARCHAR) + ')';
END

-- Add phone numbers for customer1@test.com (find the actual ID)
DECLARE @customer1Id INT;
SELECT @customer1Id = userID FROM CLIENT WHERE Email = 'customer1@test.com';
IF @customer1Id IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM CLIENT_PHONE WHERE userID = @customer1Id AND Phone_No = '0771111111')
        INSERT INTO CLIENT_PHONE (userID, Phone_No) VALUES (@customer1Id, '0771111111');
    IF NOT EXISTS (SELECT 1 FROM CLIENT_PHONE WHERE userID = @customer1Id AND Phone_No = '0771111112')
        INSERT INTO CLIENT_PHONE (userID, Phone_No) VALUES (@customer1Id, '0771111112');
    PRINT 'Phone numbers added for customer1@test.com (ID: ' + CAST(@customer1Id AS VARCHAR) + ')';
END

-- Add phone numbers for guide2@test.com
DECLARE @guide2Id INT;
SELECT @guide2Id = guideID FROM GUIDE WHERE Email = 'guide2@test.com';
IF @guide2Id IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM GUIDE_PHONE WHERE guideID = @guide2Id AND Phone_No = '0712222222')
        INSERT INTO GUIDE_PHONE (guideID, Phone_No) VALUES (@guide2Id, '0712222222');
    PRINT 'Phone numbers added for guide2@test.com (ID: ' + CAST(@guide2Id AS VARCHAR) + ')';
END

-- Add phone numbers for customer2@test.com
DECLARE @customer2Id INT;
SELECT @customer2Id = userID FROM CLIENT WHERE Email = 'customer2@test.com';
IF @customer2Id IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM CLIENT_PHONE WHERE userID = @customer2Id AND Phone_No = '0772222222')
        INSERT INTO CLIENT_PHONE (userID, Phone_No) VALUES (@customer2Id, '0772222222');
    PRINT 'Phone numbers added for customer2@test.com (ID: ' + CAST(@customer2Id AS VARCHAR) + ')';
END

-- Add phone numbers for guide3@test.com
DECLARE @guide3Id INT;
SELECT @guide3Id = guideID FROM GUIDE WHERE Email = 'guide3@test.com';
IF @guide3Id IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM GUIDE_PHONE WHERE guideID = @guide3Id AND Phone_No = '0713333333')
        INSERT INTO GUIDE_PHONE (guideID, Phone_No) VALUES (@guide3Id, '0713333333');
    PRINT 'Phone numbers added for guide3@test.com (ID: ' + CAST(@guide3Id AS VARCHAR) + ')';
END

-- Add phone numbers for customer3@test.com
DECLARE @customer3Id INT;
SELECT @customer3Id = userID FROM CLIENT WHERE Email = 'customer3@test.com';
IF @customer3Id IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM CLIENT_PHONE WHERE userID = @customer3Id AND Phone_No = '0773333333')
        INSERT INTO CLIENT_PHONE (userID, Phone_No) VALUES (@customer3Id, '0773333333');
    PRINT 'Phone numbers added for customer3@test.com (ID: ' + CAST(@customer3Id AS VARCHAR) + ')';
END

PRINT 'Phone numbers setup completed!';
