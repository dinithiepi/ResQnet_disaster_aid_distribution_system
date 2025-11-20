-- Migration: Add fields to DisasterArea table for better disaster tracking
-- This allows storing detailed information about disaster areas

ALTER TABLE DisasterArea ADD COLUMN IF NOT EXISTS AreaName VARCHAR(200);
ALTER TABLE DisasterArea ADD COLUMN IF NOT EXISTS Location VARCHAR(200);
ALTER TABLE DisasterArea ADD COLUMN IF NOT EXISTS Severity VARCHAR(20) DEFAULT 'moderate';
ALTER TABLE DisasterArea ADD COLUMN IF NOT EXISTS AffectedPopulation INT DEFAULT 0;
ALTER TABLE DisasterArea ADD COLUMN IF NOT EXISTS Description TEXT;
ALTER TABLE DisasterArea ADD COLUMN IF NOT EXISTS CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE DisasterArea ADD COLUMN IF NOT EXISTS UpdatedDate TIMESTAMP;

-- Add index for severity queries
CREATE INDEX IF NOT EXISTS idx_disasterarea_severity ON DisasterArea(Severity);

-- Severity values: 'low', 'moderate', 'high', 'critical'
