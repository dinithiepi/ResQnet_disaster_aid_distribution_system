-- Migration: Add password field to Admin table
-- Run this in your PostgreSQL database

-- Add password column to Admin table
ALTER TABLE Admin 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Update PhoneNo to be nullable (optional field)
ALTER TABLE Admin 
ALTER COLUMN PhoneNo DROP NOT NULL;

-- Add some default admin accounts for testing (password is 'admin123')
-- Hash generated using bcrypt with saltRounds=10
INSERT INTO Admin (Name, Email, PhoneNo, password)
VALUES 
  ('Ravindu Perera', 'ravindu.admin@example.com', '0771234567', '$2b$10$xQXxGzQqXK1YJ8tXQN0YEuMqKZV8N4hHqHKp5VZwZ9N8Z0XN1Y2gO'),
  ('Sajani Fernando', 'sajani.admin@example.com', '0712345678', '$2b$10$xQXxGzQqXK1YJ8tXQN0YEuMqKZV8N4hHqHKp5VZwZ9N8Z0XN1Y2gO')
ON CONFLICT (Email) DO NOTHING;

-- Note: The hashed password above is for 'admin123'
-- Admins can change their password after first login
-- Or register new accounts through the registration page
