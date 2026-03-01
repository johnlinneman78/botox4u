-- Add booking_url column to providers table
ALTER TABLE providers ADD COLUMN IF NOT EXISTS booking_url TEXT;
