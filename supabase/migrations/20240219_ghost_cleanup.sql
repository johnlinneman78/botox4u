-- Migration: Add display_status and outreach_status cleanup
-- Created: 2026-02-19

-- Add display_status column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE column_name = 'display_status' AND table_name = 'providers') THEN
        ALTER TABLE providers ADD COLUMN display_status TEXT DEFAULT 'live';
    END IF;
END $$;

-- Step 1: Hide ghosts (no place_id, no enrichment, no rating)
UPDATE providers
SET display_status = 'hidden'
WHERE google_place_id IS NULL
  AND enriched_at IS NULL
  AND rating IS NULL;

-- Step 2: Queue for address-based enrichment retry
UPDATE providers
SET outreach_status = 'retry_enrichment'
WHERE display_status = 'hidden'
  AND address IS NOT NULL;

-- Step 3: Permanent ghost — no address, no data
UPDATE providers
SET display_status = 'ghost', outreach_status = 'no_data'
WHERE display_status = 'hidden'
  AND address IS NULL;

-- Step 4: ToS Cleanup (Remove Google Photo URLs from DB)
UPDATE providers 
SET hero_image_url = NULL 
WHERE hero_image_url LIKE '%googleusercontent.com%' 
   OR hero_image_url LIKE '%googleapis.com%';
