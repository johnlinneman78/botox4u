-- Warning flag system and Results Quality Score
ALTER TABLE providers ADD COLUMN IF NOT EXISTS warning_flag BOOLEAN DEFAULT FALSE;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS warning_reason TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS flagged_at TIMESTAMPTZ;

-- Results quality and sentiment data
ALTER TABLE providers ADD COLUMN IF NOT EXISTS score_results_quality INTEGER DEFAULT 0;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS positive_keyword_count INTEGER DEFAULT 0;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS negative_keyword_count INTEGER DEFAULT 0;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS sentiment_analyzed_at TIMESTAMPTZ;
