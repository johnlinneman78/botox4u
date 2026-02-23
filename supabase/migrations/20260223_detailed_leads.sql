-- Add detailed lead capture fields to leads table
ALTER TABLE leads 
  ADD COLUMN IF NOT EXISTS current_considerations TEXT,
  ADD COLUMN IF NOT EXISTS is_first_timer BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS client_concerns TEXT[],
  ADD COLUMN IF NOT EXISTS additional_metadata JSONB DEFAULT '{}'::jsonb;

-- Update index for metadata
CREATE INDEX IF NOT EXISTS idx_leads_metadata ON leads USING GIN (additional_metadata);
