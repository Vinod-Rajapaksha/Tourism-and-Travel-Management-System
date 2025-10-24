-- Add sample completed tours for every user
-- This script creates sample reservations with COMPLETED status

-- First, let's check what users and packages we have
PRINT 'Current users and packages:';
SELECT 'GUIDES:' as Type, guideID, FirstName, LastName, Email FROM GUIDE;
SELECT 'CUSTOMERS:' as Type, userID, FirstName, LastName, Email FROM CLIENT;
SELECT 'PACKAGES:' as Type, packageID, Title, Duration FROM PACKAGE;

-- Add sample completed reservations for each customer
-- We'll create 2-3 completed tours per customer

-- Get the first customer and create reservations
DECLARE @customer1Id INT = (SELECT TOP 1 userID FROM CLIENT WHERE Email = 'customer1@test.com');
DECLARE @customer2Id INT = (SELECT TOP 1 userID FROM CLIENT WHERE Email = 'customer2@test.com');
DECLARE @customer3Id INT = (SELECT TOP 1 userID FROM CLIENT WHERE Email = 'customer3@test.com');

-- Get some guides
DECLARE @guide1Id INT = (SELECT TOP 1 guideID FROM GUIDE WHERE Email = 'guide1@test.com');
DECLARE @guide2Id INT = (SELECT TOP 1 guideID FROM GUIDE WHERE Email = 'guide2@test.com');
DECLARE @guide3Id INT = (SELECT TOP 1 guideID FROM GUIDE WHERE Email = 'guide3@test.com');

-- Get some packages
DECLARE @package1Id INT = (SELECT TOP 1 packageID FROM PACKAGE);
DECLARE @package2Id INT = (SELECT TOP 2 packageID FROM PACKAGE ORDER BY packageID OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY);
DECLARE @package3Id INT = (SELECT TOP 3 packageID FROM PACKAGE ORDER BY packageID OFFSET 2 ROWS FETCH NEXT 1 ROWS ONLY);

-- Add completed reservations for customer1@test.com
IF @customer1Id IS NOT NULL AND @guide1Id IS NOT NULL AND @package1Id IS NOT NULL
BEGIN
    -- Tour 1: Completed 2 weeks ago
    IF NOT EXISTS (SELECT 1 FROM RESERVATION WHERE userID = @customer1Id AND packageID = @package1Id AND Status = 'COMPLETED')
        INSERT INTO RESERVATION (userID, guideID, packageID, startDate, endDate, Status) 
        VALUES (@customer1Id, @guide1Id, @package1Id, DATEADD(day, -14, GETDATE()), DATEADD(day, -12, GETDATE()), 'COMPLETED');
    
    -- Tour 2: Completed 1 month ago
    IF @package2Id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM RESERVATION WHERE userID = @customer1Id AND packageID = @package2Id AND Status = 'COMPLETED')
        INSERT INTO RESERVATION (userID, guideID, packageID, startDate, endDate, Status) 
        VALUES (@customer1Id, @guide1Id, @package2Id, DATEADD(day, -30, GETDATE()), DATEADD(day, -28, GETDATE()), 'COMPLETED');
    
    PRINT 'Added completed tours for customer1@test.com';
END

-- Add completed reservations for customer2@test.com
IF @customer2Id IS NOT NULL AND @guide2Id IS NOT NULL AND @package1Id IS NOT NULL
BEGIN
    -- Tour 1: Completed 1 week ago
    IF NOT EXISTS (SELECT 1 FROM RESERVATION WHERE userID = @customer2Id AND packageID = @package1Id AND Status = 'COMPLETED')
        INSERT INTO RESERVATION (userID, guideID, packageID, startDate, endDate, Status) 
        VALUES (@customer2Id, @guide2Id, @package1Id, DATEADD(day, -7, GETDATE()), DATEADD(day, -5, GETDATE()), 'COMPLETED');
    
    -- Tour 2: Completed 3 weeks ago
    IF @package2Id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM RESERVATION WHERE userID = @customer2Id AND packageID = @package2Id AND Status = 'COMPLETED')
        INSERT INTO RESERVATION (userID, guideID, packageID, startDate, endDate, Status) 
        VALUES (@customer2Id, @guide2Id, @package2Id, DATEADD(day, -21, GETDATE()), DATEADD(day, -19, GETDATE()), 'COMPLETED');
    
    -- Tour 3: Completed 2 months ago
    IF @package3Id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM RESERVATION WHERE userID = @customer2Id AND packageID = @package3Id AND Status = 'COMPLETED')
        INSERT INTO RESERVATION (userID, guideID, packageID, startDate, endDate, Status) 
        VALUES (@customer2Id, @guide2Id, @package3Id, DATEADD(day, -60, GETDATE()), DATEADD(day, -58, GETDATE()), 'COMPLETED');
    
    PRINT 'Added completed tours for customer2@test.com';
END

-- Add completed reservations for customer3@test.com
IF @customer3Id IS NOT NULL AND @guide3Id IS NOT NULL AND @package1Id IS NOT NULL
BEGIN
    -- Tour 1: Completed 5 days ago
    IF NOT EXISTS (SELECT 1 FROM RESERVATION WHERE userID = @customer3Id AND packageID = @package1Id AND Status = 'COMPLETED')
        INSERT INTO RESERVATION (userID, guideID, packageID, startDate, endDate, Status) 
        VALUES (@customer3Id, @guide3Id, @package1Id, DATEADD(day, -5, GETDATE()), DATEADD(day, -3, GETDATE()), 'COMPLETED');
    
    -- Tour 2: Completed 1.5 months ago
    IF @package2Id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM RESERVATION WHERE userID = @customer3Id AND packageID = @package2Id AND Status = 'COMPLETED')
        INSERT INTO RESERVATION (userID, guideID, packageID, startDate, endDate, Status) 
        VALUES (@customer3Id, @guide3Id, @package2Id, DATEADD(day, -45, GETDATE()), DATEADD(day, -43, GETDATE()), 'COMPLETED');
    
    PRINT 'Added completed tours for customer3@test.com';
END

-- Add some additional completed tours with different guides for variety
-- Customer1 with Guide2
IF @customer1Id IS NOT NULL AND @guide2Id IS NOT NULL AND @package3Id IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM RESERVATION WHERE userID = @customer1Id AND packageID = @package3Id AND Status = 'COMPLETED')
        INSERT INTO RESERVATION (userID, guideID, packageID, startDate, endDate, Status) 
        VALUES (@customer1Id, @guide2Id, @package3Id, DATEADD(day, -10, GETDATE()), DATEADD(day, -8, GETDATE()), 'COMPLETED');
    
    PRINT 'Added additional tour for customer1@test.com with guide2';
END

-- Customer2 with Guide3
IF @customer2Id IS NOT NULL AND @guide3Id IS NOT NULL AND @package3Id IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM RESERVATION WHERE userID = @customer2Id AND packageID = @package3Id AND Status = 'COMPLETED')
        INSERT INTO RESERVATION (userID, guideID, packageID, startDate, endDate, Status) 
        VALUES (@customer2Id, @guide3Id, @package3Id, DATEADD(day, -15, GETDATE()), DATEADD(day, -13, GETDATE()), 'COMPLETED');
    
    PRINT 'Added additional tour for customer2@test.com with guide3';
END

-- Customer3 with Guide1
IF @customer3Id IS NOT NULL AND @guide1Id IS NOT NULL AND @package2Id IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM RESERVATION WHERE userID = @customer3Id AND packageID = @package2Id AND Status = 'COMPLETED')
        INSERT INTO RESERVATION (userID, guideID, packageID, startDate, endDate, Status) 
        VALUES (@customer3Id, @guide1Id, @package2Id, DATEADD(day, -25, GETDATE()), DATEADD(day, -23, GETDATE()), 'COMPLETED');
    
    PRINT 'Added additional tour for customer3@test.com with guide1';
END

-- Show the results
PRINT 'Sample completed tours added successfully!';
PRINT 'Summary of completed reservations:';

SELECT 
    r.reservationID,
    c.FirstName + ' ' + c.LastName as CustomerName,
    c.Email as CustomerEmail,
    g.FirstName + ' ' + g.LastName as GuideName,
    p.Title as PackageTitle,
    r.startDate,
    r.endDate,
    r.Status
FROM RESERVATION r
JOIN CLIENT c ON r.userID = c.userID
JOIN GUIDE g ON r.guideID = g.guideID
JOIN PACKAGE p ON r.packageID = p.packageID
WHERE r.Status = 'COMPLETED'
ORDER BY r.startDate DESC;

PRINT 'Total completed reservations: ' + CAST((SELECT COUNT(*) FROM RESERVATION WHERE Status = 'COMPLETED') AS VARCHAR(10));
