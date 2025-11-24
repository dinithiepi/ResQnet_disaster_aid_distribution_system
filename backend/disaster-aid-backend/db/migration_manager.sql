-- Migration: Manager System with Certificate Upload
-- Run this after the main script.sql

-- Add authentication and certificate fields to AidCenterManager
ALTER TABLE AidCenterManager 
ADD COLUMN IF NOT EXISTS Password VARCHAR(255),
ADD COLUMN IF NOT EXISTS CertificatePath VARCHAR(500),
ADD COLUMN IF NOT EXISTS Status VARCHAR(20) DEFAULT 'pending' CHECK (Status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS ApprovedBy INT,
ADD COLUMN IF NOT EXISTS ApprovedAt TIMESTAMP;

-- Add foreign key for approval
ALTER TABLE AidCenterManager
ADD CONSTRAINT fk_manager_approved_by FOREIGN KEY (ApprovedBy) REFERENCES Admin(AdminID);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_manager_status ON AidCenterManager(Status);
CREATE INDEX IF NOT EXISTS idx_manager_email ON AidCenterManager(Email);

-- Create ChatMessage table for manager-admin communication
CREATE TABLE IF NOT EXISTS ChatMessage (
    MessageID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    SenderType VARCHAR(20) NOT NULL CHECK (SenderType IN ('admin', 'manager')),
    SenderID INT NOT NULL,
    ReceiverType VARCHAR(20) NOT NULL CHECK (ReceiverType IN ('admin', 'manager')),
    ReceiverID INT NOT NULL,
    Message TEXT NOT NULL,
    IsRead BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_receiver ON ChatMessage(ReceiverType, ReceiverID, IsRead);
CREATE INDEX IF NOT EXISTS idx_chat_created ON ChatMessage(CreatedAt DESC);

-- Create AidCenterInventory table (specific to each aid center)
CREATE TABLE IF NOT EXISTS AidCenterInventory (
    InventoryID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    CenterID INT NOT NULL,
    ItemCategory VARCHAR(100) NOT NULL,
    Quantity INT CHECK (Quantity >= 0) DEFAULT 0,
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedBy INT,
    CONSTRAINT fk_center_inventory FOREIGN KEY (CenterID) REFERENCES AidCenter(CenterID),
    CONSTRAINT fk_inventory_manager FOREIGN KEY (UpdatedBy) REFERENCES AidCenterManager(ManagerID)
);

CREATE INDEX IF NOT EXISTS idx_center_inventory ON AidCenterInventory(CenterID);

-- Link managers to specific aid centers
ALTER TABLE AidCenterManager
ADD COLUMN IF NOT EXISTS CenterID INT,
ADD CONSTRAINT fk_manager_center FOREIGN KEY (CenterID) REFERENCES AidCenter(CenterID);
