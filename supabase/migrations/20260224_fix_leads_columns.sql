
-- Migration to add missing columns to leads table for better tracking
-- This adds the columns requested for the clinic audit system

ALTER TABLE leads ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS call_time TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS current_considerations TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_first_timer BOOLEAN DEFAULT TRUE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS client_concerns JSONB DEFAULT '[]'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS additional_metadata JSONB DEFAULT '{}'::jsonb;

-- Add indexes for common search patterns
CREATE INDEX IF NOT EXISTS idx_leads_state ON leads(state);
CREATE INDEX IF NOT EXISTS idx_leads_provider_id ON leads(provider_id);
