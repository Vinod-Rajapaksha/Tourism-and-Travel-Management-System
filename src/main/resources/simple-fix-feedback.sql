-- Simple fix for FEEDBACK table IDENTITY column issue
-- This script recreates the FEEDBACK table with proper IDENTITY column

-- Drop existing FEEDBACK table if it exists
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[FEEDBACK]') AND type in (N'U'))
BEGIN
    PRINT 'Dropping existing FEEDBACK table...';
    DROP TABLE FEEDBACK;
END

-- Create FEEDBACK table with proper IDENTITY column
PRINT 'Creating FEEDBACK table with IDENTITY column...';
CREATE TABLE FEEDBACK (
    feedbackID INT IDENTITY(1,1) PRIMARY KEY,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT,
    packageID INT,
    userID INT
);

-- Add foreign key constraints
PRINT 'Adding foreign key constraints...';
ALTER TABLE FEEDBACK 
ADD CONSTRAINT FK_FEEDBACK_PACKAGE 
FOREIGN KEY (packageID) REFERENCES PACKAGE(packageID);

ALTER TABLE FEEDBACK 
ADD CONSTRAINT FK_FEEDBACK_CLIENT 
FOREIGN KEY (userID) REFERENCES CLIENT(userID);

PRINT 'FEEDBACK table created successfully with IDENTITY column!';
