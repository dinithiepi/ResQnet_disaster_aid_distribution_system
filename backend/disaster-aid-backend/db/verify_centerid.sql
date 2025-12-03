-- Verify and fix CenterID column in AidCenterManager table
\c disasteraiddb;

-- Check if centerid column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'aidcentermanager' AND column_name = 'centerid';

-- If column doesn't exist, add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'aidcentermanager' AND column_name = 'centerid'
    ) THEN
        ALTER TABLE AidCenterManager ADD COLUMN CenterID INT;
        ALTER TABLE AidCenterManager 
            ADD CONSTRAINT fk_manager_center FOREIGN KEY (CenterID) REFERENCES AidCenter(CenterID);
        RAISE NOTICE 'CenterID column added';
    ELSE
        RAISE NOTICE 'CenterID column already exists';
    END IF;
END $$;

-- Show current manager data
SELECT managerid, fname, lname, email, centerid, status, district
FROM aidcentermanager
ORDER BY managerid;

-- Show aid centers
SELECT centerid, district, location
FROM aidcenter
ORDER BY centerid;
