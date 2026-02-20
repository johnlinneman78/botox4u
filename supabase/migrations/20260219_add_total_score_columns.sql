-- Add Total Score and Grade columns for V2
ALTER TABLE providers ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS score_grade TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS score_breakdown JSONB;

COMMENT ON COLUMN providers.score IS 'Total Botox-4U Score (0-100)';
COMMENT ON COLUMN providers.score_grade IS 'Letter grade based on total score (A+, A, B, etc.)';
COMMENT ON COLUMN providers.score_breakdown IS 'Detailed breakdown of the 6 scoring factors';
