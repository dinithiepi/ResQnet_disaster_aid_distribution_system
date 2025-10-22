-- PostgreSQL-compatible script for "Disaster Aid Management System"

-- 1) Create database (optional: skip if it already exists)
drop database if exists disasteraiddb;
CREATE DATABASE disasteraiddb;
\c disasteraiddb;

-- Table: Admin
CREATE TABLE IF NOT EXISTS Admin (
    AdminID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PhoneNo VARCHAR(20) NOT NULL
);

-- Table: AidCenter
CREATE TABLE IF NOT EXISTS AidCenter (
    CenterID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    District VARCHAR(100),
    Location VARCHAR(150)
);

-- Table: AidCenterManager
-- "Name" is a generated (stored) column combining FName and LName
CREATE TABLE IF NOT EXISTS AidCenterManager (
    ManagerID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    FName VARCHAR(50),
    LName VARCHAR(50),
    Name VARCHAR(101) GENERATED ALWAYS AS (FName || ' ' || LName) STORED,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PhoneNo VARCHAR(20),
    District VARCHAR(100),
    AdminID INT,
    CONSTRAINT fk_aidcenter_admin FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
);

-- Table: DisasterArea
CREATE TABLE IF NOT EXISTS DisasterArea (
    DisasterNo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    District VARCHAR(100),
    AidCenterID INT,
    CONSTRAINT fk_disaster_aidcenter FOREIGN KEY (AidCenterID) REFERENCES AidCenter(CenterID)
);

-- Table: Inventory
CREATE TABLE IF NOT EXISTS Inventory (
    ItemID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ItemCategory VARCHAR(100),
    Quantity INT CHECK (Quantity >= 0),
    AdminID INT,
    CONSTRAINT fk_inventory_admin FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
);

-- Table: Donation
CREATE TABLE IF NOT EXISTS Donation (
    DonationID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ItemID INT,
    ItemCategory VARCHAR(100),
    Quantity INT CHECK (Quantity >= 0),
    VolunteerName VARCHAR(100),
    VolunteerPhoneNo VARCHAR(20),
    AdminID INT,
    CONSTRAINT fk_donation_item FOREIGN KEY (ItemID) REFERENCES Inventory(ItemID),
    CONSTRAINT fk_donation_admin FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
);

-- (Optional) Indexes for faster lookups (example)
CREATE INDEX IF NOT EXISTS idx_inventory_category ON Inventory(ItemCategory);
CREATE INDEX IF NOT EXISTS idx_donation_item ON Donation(ItemID);
