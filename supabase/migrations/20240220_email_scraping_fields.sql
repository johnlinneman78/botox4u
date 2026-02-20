-- Add columns following the Email Scraping Playbook
ALTER TABLE providers 
  ADD COLUMN IF NOT EXISTS email_primary TEXT,
  ADD COLUMN IF NOT EXISTS email_secondary TEXT[],
  -- Confidence 0-1
  ADD COLUMN IF NOT EXISTS email_confidence FLOAT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS email_scrape_date TIMESTAMP,
  -- Status: pending, valid, no_email
  ADD COLUMN IF NOT EXISTS email_status VARCHAR DEFAULT 'pending';

-- Index for outreach queries
CREATE INDEX IF NOT EXISTS idx_providers_email_status 
  ON providers(email_status);

CREATE INDEX IF NOT EXISTS idx_providers_email_primary 
  ON providers(email_primary) 
  WHERE email_primary IS NOT NULL;
