-- Add 2026 Strategic Pivot columns to providers table
ALTER TABLE providers 
  ADD COLUMN IF NOT EXISTS offers_long_acting_tox BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS uses_ai_diagnostics BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS score_results_quality INTEGER DEFAULT 15;

-- Update comments for clarity
COMMENT ON COLUMN providers.offers_long_acting_tox IS 'True if provider offers next-gen neuromodulators (e.g. Daxxify)';
COMMENT ON COLUMN providers.uses_ai_diagnostics IS 'True if provider utilizes AI-driven skin/face analysis tools';
COMMENT ON COLUMN providers.score_results_quality IS 'Manual audit score for Natural Results Integrity (0-40)';
