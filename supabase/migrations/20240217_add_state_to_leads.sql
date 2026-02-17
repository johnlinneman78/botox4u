-- Add state column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS state TEXT;

-- Index for performance (optional but good practice)
CREATE INDEX IF NOT EXISTS idx_leads_state ON leads(state);
