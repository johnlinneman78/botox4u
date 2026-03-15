CREATE TABLE IF NOT EXISTS provider_practitioners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT NOT NULL,
  credential_suffix TEXT,
  normalized_license_type TEXT,  -- MD, DO, NP, PA, RN, DDS
  title TEXT,
  bio_snippet TEXT,
  source_url TEXT,
  
  -- NPI data (populated in Step 2)
  npi_number TEXT,
  npi_verified BOOLEAN DEFAULT false,
  npi_taxonomy_code TEXT,
  npi_taxonomy_description TEXT,
  npi_state TEXT,
  npi_license_number TEXT,
  npi_enumeration_date DATE,
  npi_last_updated DATE,
  npi_lookup_attempted BOOLEAN DEFAULT false,
  npi_lookup_attempted_at TIMESTAMPTZ,
  npi_match_confidence TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes to speed up queries
CREATE INDEX IF NOT EXISTS idx_practitioners_provider ON provider_practitioners(provider_id);
CREATE INDEX IF NOT EXISTS idx_practitioners_npi ON provider_practitioners(npi_number);
CREATE INDEX IF NOT EXISTS idx_practitioners_license ON provider_practitioners(normalized_license_type);
CREATE INDEX IF NOT EXISTS idx_practitioners_last_name ON provider_practitioners(last_name);
