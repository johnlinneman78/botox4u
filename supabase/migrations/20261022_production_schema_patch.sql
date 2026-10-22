-- Production schema patch — Oct 22, 2026
-- Status: WRITTEN, NOT APPLIED. Requires owner approval before anyone runs it.
--
-- Why this exists: the post-deploy verification (Oct 22, 2026) confirmed the
-- production Supabase database is missing pieces the claim and payment code
-- requires:
--   providers.claimed, providers.email, providers.crm_status,
--   and the provider_accounts table do not exist in production.
-- The on-disk migrations that define them were never applied to production.
-- Every statement below is idempotent (IF NOT EXISTS / guarded), so running
-- this file once is safe even where a column already exists.
--
-- Before applying: diff production information_schema against the full
-- migrations folder and schema.sql, and add anything else the money path
-- touches that production is missing. Fix the drift once, in one patch.

-- 1. Claim flow: providers columns (email defined in
--    20240219_add_email_to_providers.sql; claimed exists in schema.sql but
--    has no incremental migration on disk, so it is added here)
ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS claimed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS crm_status TEXT DEFAULT 'lead',
  ADD COLUMN IF NOT EXISTS dashboard_visited_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS photo_priority_score INTEGER DEFAULT 0;

-- 2. Claim flow: provider_accounts table (from 20260219_claim_flow_init.sql)
CREATE TABLE IF NOT EXISTS provider_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  password_hash TEXT,
  verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  last_login TIMESTAMPTZ,
  last_dashboard_visit TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

ALTER TABLE provider_accounts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  CREATE POLICY "Providers can view their own account"
    ON provider_accounts FOR SELECT
    USING (auth.uid()::text = id::text OR auth.role() = 'service_role');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_provider_accounts_email ON provider_accounts(email);
CREATE INDEX IF NOT EXISTS idx_provider_accounts_provider ON provider_accounts(provider_id);
CREATE INDEX IF NOT EXISTS idx_providers_crm_status ON providers(crm_status);

-- 3. Stripe/subscription columns the webhook writes
--    (from 20260220_stripe_init.sql; included so the payment handler cannot
--    fail on a missing column if production predates that migration too)
ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR,
  ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR,
  ADD COLUMN IF NOT EXISTS subscription_start TIMESTAMP,
  ADD COLUMN IF NOT EXISTS subscription_status VARCHAR DEFAULT 'free';

CREATE INDEX IF NOT EXISTS idx_providers_stripe_customer_id ON providers(stripe_customer_id);

-- 4. Signup/dashboard linkage column written by the provider signup flow
ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS user_id UUID;
