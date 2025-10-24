USE TTMS;

-- Guide: set known email + bcrypt for 'password'
IF EXISTS (SELECT 1 FROM GUIDE WHERE NIC = '901234567V')
    BEGIN
        UPDATE GUIDE
        SET Email = 'guide1@test.com',
            Password = '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq',
            Status = 'Available'
        WHERE NIC = '901234567V';
    END
ELSE
    BEGIN
        SET IDENTITY_INSERT GUIDE ON;
        INSERT INTO GUIDE (guideID, FirstName, LastName, Email, Password, Gender, NIC, Status)
        VALUES (101,'John','Smith','guide1@test.com',
                '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq','Male','901234567V','Available');
        SET IDENTITY_INSERT GUIDE OFF;
    END

-- Client: set known email + bcrypt for 'password'
IF EXISTS (SELECT 1 FROM CLIENT WHERE NIC = '801234567V')
    BEGIN
        UPDATE CLIENT
        SET Email = 'customer1@test.com',
            Password = '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq'
        WHERE NIC = '801234567V';
    END
ELSE
    BEGIN
        SET IDENTITY_INSERT CLIENT ON;
        INSERT INTO CLIENT (userID, FirstName, LastName, Email, Password, Gender, NIC)
        VALUES (201,'Alice','Brown','customer1@test.com',
                '$2a$10$M/sKlc9hzsrligRBSdBuSOLJzKDbnabIa8Zv2alZ5PUdrOBksWxUq','Female','801234567V');
        SET IDENTITY_INSERT CLIENT OFF;
    END