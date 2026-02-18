-- Add enrichment columns to providers table
ALTER TABLE providers ADD COLUMN IF NOT EXISTS google_place_id TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1);
ALTER TABLE providers ADD COLUMN IF NOT EXISTS review_count INTEGER;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]';
ALTER TABLE providers ADD COLUMN IF NOT EXISTS top_reviews JSONB DEFAULT '[]';
ALTER TABLE providers ADD COLUMN IF NOT EXISTS ai_description TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS ai_description_confirmed BOOLEAN DEFAULT FALSE;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]';
ALTER TABLE providers ADD COLUMN IF NOT EXISTS enriched_at TIMESTAMPTZ;

-- Create enrichment queue table
CREATE TABLE IF NOT EXISTS providers_enrichment_queue (
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'complete', 'failed')),
  retry_count INTEGER DEFAULT 0,
  last_attempted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (provider_id)
);

-- Index for queue processing
CREATE INDEX IF NOT EXISTS idx_enrichment_queue_status ON providers_enrichment_queue(status);
