-- Add user association and analytics tracking columns to providers table
ALTER TABLE providers 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS views_30d INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS clicks_30d INTEGER DEFAULT 0;

-- Create index for user_id lookup
CREATE INDEX IF NOT EXISTS idx_providers_user_id ON providers(user_id);
