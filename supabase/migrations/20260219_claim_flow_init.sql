-- Claim Flow Infrastructure
-- Step 3 of BUILD ORDER: Create provider_accounts table
-- Step 10 of BUILD ORDER: Tracking CRM status

-- Create provider_accounts table for dashboard access
CREATE TABLE IF NOT EXISTS provider_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  email TEXT NOT NULL, -- Email used for login/dashboard
  password_hash TEXT, -- Will be set after verification
  verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  last_login TIMESTAMPTZ,
  last_dashboard_visit TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

-- Add CRM tracking and photo priority tracking to providers table
ALTER TABLE providers 
  ADD COLUMN IF NOT EXISTS crm_status TEXT DEFAULT 'lead', -- 'lead', 'engaged', 'verified', 'customer'
  ADD COLUMN IF NOT EXISTS dashboard_visited_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS photo_priority_score INTEGER DEFAULT 0; -- Used for photo priority logic (Step 6)

-- Enable RLS on provider_accounts
ALTER TABLE provider_accounts ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies for provider_accounts
CREATE POLICY "Providers can view their own account"
  ON provider_accounts FOR SELECT
  USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_provider_accounts_email ON provider_accounts(email);
CREATE INDEX IF NOT EXISTS idx_provider_accounts_provider ON provider_accounts(provider_id);
CREATE INDEX IF NOT EXISTS idx_providers_crm_status ON providers(crm_status);

COMMENT ON COLUMN providers.crm_status IS 'CRM tracking status: lead, engaged, verified, customer';
COMMENT ON COLUMN providers.photo_priority_score IS 'Boost score for providers who have verified photos';
