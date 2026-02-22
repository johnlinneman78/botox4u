-- Warning flag system
ALTER TABLE providers ADD COLUMN IF NOT EXISTS warning_flag BOOLEAN DEFAULT FALSE;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS warning_reason TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS flagged_at TIMESTAMP WITH TIME ZONE;

-- Results quality score
ALTER TABLE providers ADD COLUMN IF NOT EXISTS score_results_quality INTEGER DEFAULT 0;

-- Positive and negative keyword counts from reviews
ALTER TABLE providers ADD COLUMN IF NOT EXISTS positive_keyword_count INTEGER DEFAULT 0;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS negative_keyword_count INTEGER DEFAULT 0;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS sentiment_analyzed_at TIMESTAMP WITH TIME ZONE;
