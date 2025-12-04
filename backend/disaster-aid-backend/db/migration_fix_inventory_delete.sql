-- Migration: Fix Inventory deletion issue
-- Problem: Cannot delete inventory items that are referenced by donations
-- Solution: Change foreign key constraint to SET NULL on delete (preserves donation history)

-- Drop existing constraint
ALTER TABLE Donation DROP CONSTRAINT IF EXISTS fk_donation_item;

-- Add new constraint with ON DELETE SET NULL
-- This allows inventory items to be deleted while preserving donation records
ALTER TABLE Donation 
ADD CONSTRAINT fk_donation_item 
FOREIGN KEY (ItemID) REFERENCES Inventory(ItemID) 
ON DELETE SET NULL;

-- Verify the change
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
LEFT JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_name = 'fk_donation_item';
