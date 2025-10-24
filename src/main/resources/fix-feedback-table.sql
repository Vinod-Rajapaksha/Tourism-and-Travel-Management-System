-- Fix FEEDBACK table to have proper IDENTITY column
-- This script fixes the feedbackID column to be auto-increment

-- First, check if the table exists and has the right structure
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[FEEDBACK]') AND type in (N'U'))
BEGIN
    -- Check if feedbackID is already an IDENTITY column
    IF NOT EXISTS (
        SELECT 1 
        FROM sys.identity_columns 
        WHERE object_id = OBJECT_ID('FEEDBACK') 
        AND name = 'feedbackID'
    )
    BEGIN
        PRINT 'Fixing FEEDBACK table feedbackID column...';
        
        -- Create a temporary table with the correct structure
        CREATE TABLE FEEDBACK_TEMP (
            feedbackID INT IDENTITY(1,1) PRIMARY KEY,
            Rating INT CHECK (Rating BETWEEN 1 AND 5),
            Comment TEXT,
            packageID INT,
            userID INT
        );
        
        -- Copy existing data (if any)
        INSERT INTO FEEDBACK_TEMP (Rating, Comment, packageID, userID)
        SELECT Rating, Comment, packageID, userID FROM FEEDBACK;
        
        -- Drop the old table
        DROP TABLE FEEDBACK;
        
        -- Rename the temp table
        EXEC sp_rename 'FEEDBACK_TEMP', 'FEEDBACK'
        
        -- Add foreign key constraints
        ALTER TABLE FEEDBACK 
        ADD CONSTRAINT FK_FEEDBACK_PACKAGE 
        FOREIGN KEY (packageID) REFERENCES PACKAGE(packageID);
        
        ALTER TABLE FEEDBACK 
        ADD CONSTRAINT FK_FEEDBACK_CLIENT 
        FOREIGN KEY (userID) REFERENCES CLIENT(userID);
        
        PRINT 'FEEDBACK table fixed successfully!';
    END
    ELSE
    BEGIN
        PRINT 'FEEDBACK table already has correct IDENTITY column.';
    END
END
ELSE
BEGIN
    PRINT 'FEEDBACK table does not exist. Creating it...';
    
    -- Create the FEEDBACK table with proper IDENTITY column
    CREATE TABLE FEEDBACK (
        feedbackID INT IDENTITY(1,1) PRIMARY KEY,
        Rating INT CHECK (Rating BETWEEN 1 AND 5),
        Comment TEXT,
        packageID INT,
        userID INT,
        FOREIGN KEY (packageID) REFERENCES PACKAGE(packageID),
        FOREIGN KEY (userID) REFERENCES CLIENT(userID)
    );
    
    PRINT 'FEEDBACK table created successfully!';
END
