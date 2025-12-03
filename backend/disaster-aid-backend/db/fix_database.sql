-- Complete Database Setup Script
-- Run this if you're having issues with missing tables

-- Connect to database
\c disasteraiddb;

-- Check if itemrequest table exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'itemrequest') THEN
        CREATE TABLE itemrequest (
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
        
        CREATE INDEX idx_request_status ON itemrequest(Status);
        CREATE INDEX idx_request_manager ON itemrequest(ManagerID);
        CREATE INDEX idx_request_center ON itemrequest(CenterID);
        CREATE INDEX idx_request_created ON itemrequest(RequestedAt DESC);
        
        RAISE NOTICE 'itemrequest table created successfully';
    ELSE
        RAISE NOTICE 'itemrequest table already exists';
    END IF;
END $$;

-- Ensure CenterID column exists in AidCenterManager
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'aidcentermanager' AND column_name = 'centerid'
    ) THEN
        ALTER TABLE AidCenterManager ADD COLUMN CenterID INT;
        ALTER TABLE AidCenterManager ADD CONSTRAINT fk_manager_center 
            FOREIGN KEY (CenterID) REFERENCES AidCenter(CenterID);
        RAISE NOTICE 'CenterID column added to AidCenterManager';
    ELSE
        RAISE NOTICE 'CenterID column already exists in AidCenterManager';
    END IF;
END $$;

-- Drop ChatMessage table if it exists
DROP TABLE IF EXISTS ChatMessage;

-- Verify tables
SELECT 
    'admin' as table_name, COUNT(*) as row_count FROM admin
UNION ALL
SELECT 'aidcenter', COUNT(*) FROM aidcenter
UNION ALL
SELECT 'aidcentermanager', COUNT(*) FROM aidcentermanager
UNION ALL
SELECT 'itemrequest', COUNT(*) FROM itemrequest;

-- Show structure of itemrequest table
\d itemrequest;

-- Check if any managers have centerid assigned
SELECT managerid, name, email, centerid, status 
FROM aidcentermanager 
WHERE status = 'approved';

RAISE NOTICE 'Database setup complete!';
