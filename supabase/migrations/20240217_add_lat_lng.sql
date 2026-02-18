-- Add latitude and longitude columns to providers table
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS lat FLOAT8,
ADD COLUMN IF NOT EXISTS lng FLOAT8;

-- Add index for geospatial queries (optional but recommended for maps)
CREATE INDEX IF NOT EXISTS idx_providers_lat_lng ON providers(lat, lng);
