-- Add NPI verification columns to providers table
ALTER TABLE providers 
  ADD COLUMN IF NOT EXISTS npi_number VARCHAR(10),
  ADD COLUMN IF NOT EXISTS npi_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS npi_license_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS npi_specialty VARCHAR(100),
  ADD COLUMN IF NOT EXISTS npi_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS npi_lookup_attempted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS allergan_tier VARCHAR(50);
