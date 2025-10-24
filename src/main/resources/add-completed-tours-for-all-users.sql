-- Add sample completed tours for ALL existing users
-- This script creates sample reservations with COMPLETED status for every customer

PRINT 'Adding completed tours for all existing customers...';

-- Create a cursor to iterate through all customers
DECLARE @customerId INT;
DECLARE @customerName NVARCHAR(100);
DECLARE @customerEmail NVARCHAR(100);

DECLARE customer_cursor CURSOR FOR
SELECT userID, FirstName + ' ' + LastName, Email FROM CLIENT;

OPEN customer_cursor;
FETCH NEXT FROM customer_cursor INTO @customerId, @customerName, @customerEmail;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Get a random guide for this customer
    DECLARE @guideId INT = (
        SELECT TOP 1 guideID 
        FROM GUIDE 
        ORDER BY NEWID()
    );
    
    -- Get available packages
    DECLARE @package1Id INT = (SELECT TOP 1 packageID FROM PACKAGE ORDER BY NEWID());
    DECLARE @package2Id INT = (
        SELECT TOP 1 packageID 
        FROM PACKAGE 
        WHERE packageID != @package1Id 
        ORDER BY NEWID()
    );
    DECLARE @package3Id INT = (
        SELECT TOP 1 packageID 
        FROM PACKAGE 
        WHERE packageID NOT IN (@package1Id, @package2Id) 
        ORDER BY NEWID()
    );
    
    -- Add 2-3 completed tours for this customer
    IF @guideId IS NOT NULL AND @package1Id IS NOT NULL
    BEGIN
        -- Tour 1: Completed 1-2 weeks ago
        IF NOT EXISTS (SELECT 1 FROM RESERVATION WHERE userID = @customerId AND packageID = @package1Id AND Status = 'COMPLETED')
        BEGIN
            INSERT INTO RESERVATION (userID, guideID, packageID, startDate, endDate, Status) 
            VALUES (@customerId, @guideId, @package1Id, 
                   DATEADD(day, -14 + (ABS(CHECKSUM(NEWID())) % 7), GETDATE()), 
                   DATEADD(day, -12 + (ABS(CHECKSUM(NEWID())) % 7), GETDATE()), 
                   'COMPLETED');
            PRINT 'Added tour 1 for ' + @customerName + ' (' + @customerEmail + ')';
        END
        
        -- Tour 2: Completed 3-4 weeks ago
        IF @package2Id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM RESERVATION WHERE userID = @customerId AND packageID = @package2Id AND Status = 'COMPLETED')
        BEGIN
            INSERT INTO RESERVATION (userID, guideID, packageID, startDate, endDate, Status) 
            VALUES (@customerId, @guideId, @package2Id, 
                   DATEADD(day, -28 + (ABS(CHECKSUM(NEWID())) % 7), GETDATE()), 
                   DATEADD(day, -26 + (ABS(CHECKSUM(NEWID())) % 7), GETDATE()), 
                   'COMPLETED');
            PRINT 'Added tour 2 for ' + @customerName + ' (' + @customerEmail + ')';
        END
        
        -- Tour 3: Completed 1-2 months ago (if we have a third package)
        IF @package3Id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM RESERVATION WHERE userID = @customerId AND packageID = @package3Id AND Status = 'COMPLETED')
        BEGIN
            INSERT INTO RESERVATION (userID, guideID, packageID, startDate, endDate, Status) 
            VALUES (@customerId, @guideId, @package3Id, 
                   DATEADD(day, -45 + (ABS(CHECKSUM(NEWID())) % 14), GETDATE()), 
                   DATEADD(day, -43 + (ABS(CHECKSUM(NEWID())) % 14), GETDATE()), 
                   'COMPLETED');
            PRINT 'Added tour 3 for ' + @customerName + ' (' + @customerEmail + ')';
        END
    END
    
    FETCH NEXT FROM customer_cursor INTO @customerId, @customerName, @customerEmail;
END

CLOSE customer_cursor;
DEALLOCATE customer_cursor;

-- Show summary
PRINT 'Completed adding tours for all customers!';
PRINT 'Summary:';

SELECT 
    COUNT(*) as TotalCompletedTours,
    COUNT(DISTINCT r.userID) as CustomersWithTours,
    COUNT(DISTINCT r.guideID) as GuidesWithTours,
    COUNT(DISTINCT r.packageID) as PackagesUsed
FROM RESERVATION r
WHERE r.Status = 'COMPLETED';

-- Show recent completed tours
PRINT 'Recent completed tours:';
SELECT TOP 10
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
