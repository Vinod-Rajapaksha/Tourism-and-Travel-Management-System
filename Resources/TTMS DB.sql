-- Create the database
CREATE DATABASE TTMS;
GO
USE TTMS;
GO

-- Create Client Table
CREATE TABLE Client (
  userID      BIGINT IDENTITY(1,1) PRIMARY KEY,
  fName       NVARCHAR(100)       NOT NULL,
  lName       NVARCHAR(100)       NOT NULL,
  gender      NVARCHAR(16)        NULL,
  NIC         NVARCHAR(20)        NULL UNIQUE,
  email       NVARCHAR(255)       NOT NULL UNIQUE,
  password    NVARCHAR(255)       NOT NULL,
  phone       NVARCHAR(20)        NULL,
  createdAt   DATETIME2(3)        NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- Create Admin Table
CREATE TABLE Admin (
  adminID     BIGINT IDENTITY(1,1) PRIMARY KEY,
  fName       NVARCHAR(100)       NOT NULL,
  lName       NVARCHAR(100)       NOT NULL,
  role        NVARCHAR(50)        NOT NULL, 
  email       NVARCHAR(255)       NOT NULL UNIQUE,
  password    NVARCHAR(255)       NOT NULL,
  phone       NVARCHAR(20)        NULL,
  createdAt   DATETIME2(3)        NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- Create Guides Table
CREATE TABLE Guides (
  guideID     BIGINT IDENTITY(1,1) PRIMARY KEY,
  fName       NVARCHAR(100)       NOT NULL,
  lName       NVARCHAR(100)       NOT NULL,
  gender      NVARCHAR(16)        NULL,
  NIC         NVARCHAR(20)        NULL UNIQUE,
  email       NVARCHAR(255)       NOT NULL UNIQUE,
  password    NVARCHAR(255)       NOT NULL,
  phone       NVARCHAR(20)        NULL,
  status      NVARCHAR(16)        NOT NULL
  CONSTRAINT CK_Guides_Status CHECK (status IN ('ACTIVE','INACTIVE')),
  createdAt   DATETIME2(3)        NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- Create Packages Table
CREATE TABLE Packages (
  packageID   BIGINT IDENTITY(1,1) PRIMARY KEY,
  image       NVARCHAR(300)       NULL,
  title       NVARCHAR(150)       NOT NULL,
  description NVARCHAR(MAX)       NULL,
  price       DECIMAL(10,2)       NOT NULL,
  offer       DECIMAL(5,2)        NULL,
  status      NVARCHAR(16)        NOT NULL
  CONSTRAINT CK_Packages_Status CHECK (status IN ('ACTIVE','INACTIVE')),
  createdAt   DATETIME2(3)        NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- Create Payment Table
CREATE TABLE Payment (
  paymentID     BIGINT IDENTITY(1,1) PRIMARY KEY,
  userID        BIGINT             NOT NULL,
  packageID     BIGINT             NOT NULL,
  amount        DECIMAL(10,2)      NOT NULL,
  paymentDate   DATETIME2(3)       NOT NULL DEFAULT SYSUTCDATETIME(),
  status        NVARCHAR(16)       NOT NULL
  CONSTRAINT CK_Payment_Status CHECK (status IN ('PENDING','SUCCESS','FAILED','REFUNDED')),
  CONSTRAINT FK_Payment_User     FOREIGN KEY (userID)    REFERENCES Client(userID),
  CONSTRAINT FK_Payment_Package  FOREIGN KEY (packageID) REFERENCES Packages(packageID)
);
GO

-- Create Reservation Table
CREATE TABLE Reservation (
  reservationID BIGINT IDENTITY(1,1) PRIMARY KEY,
  userID        BIGINT             NOT NULL,
  packageID     BIGINT             NOT NULL,
  guideID       BIGINT             NULL,
  paymentID     BIGINT             NULL,
  status        NVARCHAR(16)       NOT NULL
  CONSTRAINT CK_Reservation_Status CHECK (status IN ('PENDING','CONFIRMED','CANCELLED','COMPLETED','REFUNDED')),
  startDate     DATE               NOT NULL,
  endDate       DATE               NOT NULL,
  createdAt     DATETIME2(3)       NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_Reservation_User    FOREIGN KEY (userID)    REFERENCES Client(userID),
  CONSTRAINT FK_Reservation_Package FOREIGN KEY (packageID) REFERENCES Packages(packageID),
  CONSTRAINT FK_Reservation_Guide   FOREIGN KEY (guideID)   REFERENCES Guides(guideID),
  CONSTRAINT FK_Reservation_Payment FOREIGN KEY (paymentID) REFERENCES Payment(paymentID)
  ON DELETE SET NULL
);
GO

-- Create Feedback Table
CREATE TABLE Feedback (
  feedbackID  BIGINT IDENTITY(1,1) PRIMARY KEY,
  userID      BIGINT             NOT NULL,
  packageID   BIGINT             NOT NULL,
  rating      TINYINT            NOT NULL
  CONSTRAINT CK_Feedback_Rating CHECK (rating BETWEEN 1 AND 5),
  comment     NVARCHAR(1000)     NULL,
  submittedAt DATETIME2(3)       NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_Feedback_User    FOREIGN KEY (userID)    REFERENCES Client(userID),
  CONSTRAINT FK_Feedback_Package FOREIGN KEY (packageID) REFERENCES Packages(packageID)
);
GO

-- Create Refund Table
CREATE TABLE Refund (
  refundID    BIGINT IDENTITY(1,1) PRIMARY KEY,
  paymentID   BIGINT             NOT NULL,
  amount      DECIMAL(10,2)      NOT NULL,
  reason      NVARCHAR(255)      NULL,
  status      NVARCHAR(16)       NOT NULL
  CONSTRAINT CK_Refund_Status CHECK (status IN ('REQUESTED','APPROVED','REJECTED','ISSUED')),
  createdAt   DATETIME2(3)       NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_Refund_Payment FOREIGN KEY (paymentID) REFERENCES dbo.Payment(paymentID)
);
GO

-- Create Event Table
CREATE TABLE Event (
  eventID    BIGINT IDENTITY(1,1) PRIMARY KEY,
  title      NVARCHAR(150)       NOT NULL,
  date       DATE                NOT NULL,
  details    NVARCHAR(1000)      NULL,
  createdAt  DATETIME2(3)        NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- Helpful Indexes
CREATE INDEX IX_User_Email          ON Client(email);
CREATE INDEX IX_Guides_Status       ON Guides(status);
CREATE INDEX IX_Packages_Status     ON Packages(status);
CREATE INDEX IX_Reservation_User    ON Reservation(userID);
CREATE INDEX IX_Reservation_Package ON Reservation(packageID);
CREATE INDEX IX_Reservation_Status  ON Reservation(status);
CREATE INDEX IX_Payment_User        ON Payment(userID);
CREATE INDEX IX_Payment_Status      ON Payment(status);
GO
