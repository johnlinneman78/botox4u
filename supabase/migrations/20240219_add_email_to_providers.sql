
-- Add email column to providers table
ALTER TABLE providers ADD COLUMN IF NOT EXISTS email TEXT;

-- Index for email searching
CREATE INDEX IF NOT EXISTS idx_providers_email ON providers(email);
