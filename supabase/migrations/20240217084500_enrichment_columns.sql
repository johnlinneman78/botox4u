-- ============================================
-- National Botox Directory - Schema Update V2
-- Adds Price Transparency & AI Enrichment Support
-- ============================================

-- Add AI Enrichment JSONB column
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS enriched_attrs JSONB DEFAULT '{}'::jsonb;

-- Add verification timestamp
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Add Notion link for sync
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS notion_page_id TEXT;

-- Update Index for dynamic JSONB queries (GIST index for containment)
CREATE INDEX IF NOT EXISTS idx_providers_enriched_attrs ON providers USING GIN (enriched_attrs);

-- Add comment explaining the enriched_attrs structure
COMMENT ON COLUMN providers.enriched_attrs IS 'AI-extracted data: {offers_masseter: bool, price_per_unit_stated: float, new_patient_special: string, credentials: string[]}';

-- ============================================
-- REFRESH POLICIES (Optional, if needed)
-- ============================================
-- Standard RLS already covers these new columns
