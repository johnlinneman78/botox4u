
-- 1. Add outreach columns to providers table
ALTER TABLE providers ADD COLUMN IF NOT EXISTS outreach_status TEXT DEFAULT 'not_sent'; 
ALTER TABLE providers ADD COLUMN IF NOT EXISTS date_sent TIMESTAMPTZ;

-- 2. Index for faster queries later
CREATE INDEX idx_providers_outreach_status ON providers(outreach_status);

-- 3. (Optional) Set verified emails only for outreach
UPDATE providers SET outreach_status = 'verified' WHERE email IS NOT NULL AND outreach_status = 'not_sent';
