-- Migration: Add status and contact fields to Donation table
-- This allows tracking donation status and volunteer contact information

ALTER TABLE Donation ADD COLUMN IF NOT EXISTS Status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE Donation ADD COLUMN IF NOT EXISTS VolunteerEmail VARCHAR(100);
ALTER TABLE Donation ADD COLUMN IF NOT EXISTS VolunteerAddress TEXT;
ALTER TABLE Donation ADD COLUMN IF NOT EXISTS Notes TEXT;
ALTER TABLE Donation ADD COLUMN IF NOT EXISTS SubmittedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Donation ADD COLUMN IF NOT EXISTS ReceivedDate TIMESTAMP;

-- Add index for status queries
CREATE INDEX IF NOT EXISTS idx_donation_status ON Donation(Status);

-- Status values: 'pending', 'contacted', 'scheduled', 'received', 'rejected'
