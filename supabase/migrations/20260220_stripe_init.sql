
-- Add Stripe and Subscription columns to providers table
ALTER TABLE providers 
  ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR,
  ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR,
  ADD COLUMN IF NOT EXISTS subscription_start TIMESTAMP,
  ADD COLUMN IF NOT EXISTS subscription_status VARCHAR DEFAULT 'free';

-- Ensure outreach_status can handle 'paying'
-- (Assuming it's a TEXT column based on previous usage)

-- Create index for stripe customer lookup if needed
CREATE INDEX IF NOT EXISTS idx_providers_stripe_customer_id ON providers(stripe_customer_id);
