-- Enable pg_trgm for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index on name for trigram search (fast ilike %...% and fuzzy matching)
CREATE INDEX IF NOT EXISTS idx_providers_name_trgm ON providers USING gin (name gin_trgm_ops);

-- Create GIN index on treatment_slugs for fast .cs (contains) queries
CREATE INDEX IF NOT EXISTS idx_providers_treatment_slugs_gin ON providers USING gin (treatment_slugs);

-- Create GIN index on services_offered for fast .cs (contains) queries
CREATE INDEX IF NOT EXISTS idx_providers_services_offered_gin ON providers USING gin (services_offered);

-- Create search_logs table to track queries and identify data gaps
CREATE TABLE IF NOT EXISTS search_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    result_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index on query for analysis
CREATE INDEX IF NOT EXISTS idx_search_logs_query ON search_logs (query);

-- Index on created_at for time-based analysis
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs (created_at);
