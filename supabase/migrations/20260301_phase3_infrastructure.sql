-- Migration to support Phase 3: Agent-Ready Infrastructure

-- 1. Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  owner_name text,
  owner_email text,
  tier text DEFAULT 'FREE',
  calls_this_month integer DEFAULT 0,
  call_limit integer DEFAULT 100,
  created_at timestamp with time zone DEFAULT now(),
  active boolean DEFAULT true
);

-- 2. Add style_tags column to providers
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS style_tags text[] DEFAULT '{}';

-- 3. Create a test API key for initial development
-- Note: In production, these will be generated via the landing page
INSERT INTO api_keys (key, owner_name, owner_email, tier, call_limit)
VALUES ('ii_test_key_abc123', 'Dev Team', 'dev@injectorindex.com', 'PRO', 999999)
ON CONFLICT (key) DO NOTHING;

-- 4. Initial tagging based on review sentiment (One-time run)
-- We use ILIKE for case-insensitive matching in existing reviews
-- This logic looks for keywords in the 'reviews' JSONB column if it contains text
UPDATE providers
SET style_tags = array_append(style_tags, 'natural')
WHERE reviews::text ILIKE '%natural%' 
   OR reviews::text ILIKE '%subtle%' 
   OR reviews::text ILIKE '%conservative%' 
   OR reviews::text ILIKE '%no one could tell%'
   OR description ILIKE '%natural%'
   OR description ILIKE '%subtle%'
   OR description ILIKE '%conservative%';
