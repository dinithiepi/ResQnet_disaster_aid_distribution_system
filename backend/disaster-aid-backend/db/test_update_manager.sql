-- Test script to manually update a manager's centerid
\c disasteraiddb;

-- First, show all managers and their current centerid
SELECT managerid, fname, lname, email, centerid, status
FROM aidcentermanager
ORDER BY managerid;

-- Show all aid centers
SELECT centerid, district, location
FROM aidcenter
ORDER BY centerid;

-- To update a manager's centerid, run this (replace values):
-- UPDATE aidcentermanager SET centerid = 1 WHERE managerid = 1;

-- Example: Update manager ID 1 to center ID 1
-- Uncomment the line below and adjust values as needed:
-- UPDATE aidcentermanager SET centerid = 1, status = 'approved', approvedat = NOW() WHERE managerid = 1;

-- Verify the update
SELECT managerid, fname, lname, email, centerid, status
FROM aidcentermanager
WHERE managerid = 1;
