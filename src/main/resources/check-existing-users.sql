-- Check existing users in the database
-- This script will show us the actual IDs of existing users

-- Check existing guides
SELECT 'GUIDES:' as Info;
SELECT guideID, FirstName, LastName, Email FROM GUIDE ORDER BY guideID;

-- Check existing clients  
SELECT 'CLIENTS:' as Info;
SELECT userID, FirstName, LastName, Email FROM CLIENT ORDER BY userID;

-- Check if phone tables exist
SELECT 'PHONE TABLES:' as Info;
SELECT name FROM sys.tables WHERE name IN ('GUIDE_PHONE', 'CLIENT_PHONE');
