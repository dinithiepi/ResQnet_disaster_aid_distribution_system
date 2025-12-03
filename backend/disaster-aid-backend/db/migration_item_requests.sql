-- Migration: Item Request System
-- Adds functionality for managers to request items from admin

-- Ensure managers have aid center IDs assigned
-- This should be done when approving managers

-- Create ItemRequest table for tracking manager requests
CREATE TABLE IF NOT EXISTS ItemRequest (
    RequestID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ManagerID INT NOT NULL,
    CenterID INT NOT NULL,
    ItemCategory VARCHAR(100) NOT NULL,
    RequestedQuantity INT CHECK (RequestedQuantity > 0) NOT NULL,
    ApprovedQuantity INT CHECK (ApprovedQuantity >= 0),
    Status VARCHAR(20) DEFAULT 'pending' CHECK (Status IN ('pending', 'approved', 'rejected', 'received')),
    Remarks TEXT,
    RequestedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ReviewedBy INT,
    ReviewedAt TIMESTAMP,
    ReceivedAt TIMESTAMP,
    CONSTRAINT fk_request_manager FOREIGN KEY (ManagerID) REFERENCES AidCenterManager(ManagerID),
    CONSTRAINT fk_request_center FOREIGN KEY (CenterID) REFERENCES AidCenter(CenterID),
    CONSTRAINT fk_request_reviewer FOREIGN KEY (ReviewedBy) REFERENCES Admin(AdminID)
);

CREATE INDEX IF NOT EXISTS idx_request_status ON ItemRequest(Status);
CREATE INDEX IF NOT EXISTS idx_request_manager ON ItemRequest(ManagerID);
CREATE INDEX IF NOT EXISTS idx_request_center ON ItemRequest(CenterID);
CREATE INDEX IF NOT EXISTS idx_request_created ON ItemRequest(RequestedAt DESC);

-- Remove chat message table as it's no longer needed
DROP TABLE IF EXISTS ChatMessage;
