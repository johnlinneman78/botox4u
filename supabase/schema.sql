-- ============================================
-- National Botox Directory - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROVIDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic Info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  business_type TEXT, -- 'Medspa', 'Clinic', 'Dermatology', 'Plastic Surgery'
  description TEXT,
  
  -- Location
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Contact
  phone TEXT,
  email TEXT,
  website TEXT,
  
  -- Pricing
  price_per_unit DECIMAL(10, 2),
  min_treatment_price DECIMAL(10, 2),
  
  -- Listing
  listing_tier TEXT DEFAULT 'free', -- 'free', 'featured', 'premium'
  claimed BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  
  -- Ratings
  average_rating DECIMAL(3, 2),
  review_count INTEGER DEFAULT 0,
  
  -- Media
  image_url TEXT,
  logo_url TEXT,
  
  -- Treatments (array of slugs)
  treatment_slugs TEXT[],
  
  -- Metadata
  google_place_id TEXT,
  google_rating DECIMAL(3, 2),
  google_review_count INTEGER
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_providers_city ON providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_state ON providers(state);
CREATE INDEX IF NOT EXISTS idx_providers_tier ON providers(listing_tier);
CREATE INDEX IF NOT EXISTS idx_providers_slug ON providers(slug);

-- ============================================
-- LEADS TABLE (NO PHI - COMPLIANT)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact Info (NOT PHI)
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Location (NOT PHI)
  city TEXT,
  zip_code TEXT,
  
  -- Treatment Interest (General category only - NOT PHI)
  treatment_type TEXT, -- 'botox', 'filler', 'masseter-botox', etc.
  budget_range TEXT, -- 'under-300', '300-500', etc.
  timeframe TEXT, -- 'asap', 'this-week', 'this-month', etc.
  
  -- Message (General inquiry only - NOT PHI)
  message TEXT, -- Max 1000 chars, no medical details
  
  -- Metadata
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  source_url TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'converted', 'closed'
  
  -- Privacy
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_provider ON leads(provider_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Providers: Public read, admin write
CREATE POLICY "Public can view active providers"
  ON providers FOR SELECT
  USING (true);

CREATE POLICY "Only service role can modify providers"
  ON providers FOR ALL
  USING (auth.role() = 'service_role');

-- Leads: Public insert, admin read/update
CREATE POLICY "Anyone can submit leads"
  ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only service role can view leads"
  ON leads FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Only service role can update leads"
  ON leads FOR UPDATE
  USING (auth.role() = 'service_role');

-- ============================================
-- SAMPLE DATA (3 cities, 3 providers each)
-- ============================================

-- New York providers
INSERT INTO providers (name, slug, city, state, address, phone, website, business_type, price_per_unit, listing_tier, treatment_slugs, latitude, longitude)
VALUES
  ('Manhattan Aesthetics', 'manhattan-aesthetics-ny', 'New York', 'NY', '123 5th Ave, New York, NY 10001', '(212) 555-0100', 'https://example.com', 'Medspa', 15.00, 'free', ARRAY['botox', 'filler', 'masseter-botox'], 40.739772, -73.990494),
  ('NYC Dermatology', 'nyc-dermatology', 'New York', 'NY', '456 Park Ave, New York, NY 10022', '(212) 555-0200', 'https://example.com', 'Dermatology', 16.00, 'free', ARRAY['botox', 'dysport'], 40.761569, -73.971661),
  ('Fifth Avenue Med Spa', 'fifth-avenue-med-spa', 'New York', 'NY', '789 Madison Ave, New York, NY 10065', '(212) 555-0300', 'https://example.com', 'Medspa', 14.50, 'free', ARRAY['botox', 'filler', 'lip-filler'], 40.768681, -73.967283)
ON CONFLICT (slug) DO NOTHING;

-- Los Angeles providers
INSERT INTO providers (name, slug, city, state, address, phone, website, business_type, price_per_unit, listing_tier, treatment_slugs, latitude, longitude)
VALUES
  ('Beverly Hills Aesthetics', 'beverly-hills-aesthetics', 'Los Angeles', 'CA', '123 Rodeo Dr, Beverly Hills, CA 90210', '(310) 555-0100', 'https://example.com', 'Medspa', 16.00, 'free', ARRAY['botox', 'filler', 'masseter-botox'], 34.067332, -118.401494),
  ('LA Dermatology Center', 'la-dermatology-center', 'Los Angeles', 'CA', '456 Wilshire Blvd, Los Angeles, CA 90010', '(213) 555-0200', 'https://example.com', 'Dermatology', 15.50, 'free', ARRAY['botox', 'dysport', 'xeomin'], 34.062147, -118.300645),
  ('West Hollywood Med Spa', 'west-hollywood-med-spa', 'Los Angeles', 'CA', '789 Santa Monica Blvd, West Hollywood, CA 90069', '(323) 555-0300', 'https://example.com', 'Medspa', 14.00, 'free', ARRAY['botox', 'filler'], 34.084478, -118.384196)
ON CONFLICT (slug) DO NOTHING;

-- Miami providers
INSERT INTO providers (name, slug, city, state, address, phone, website, business_type, price_per_unit, listing_tier, treatment_slugs, latitude, longitude)
VALUES
  ('South Beach Aesthetics', 'south-beach-aesthetics', 'Miami', 'FL', '123 Ocean Dr, Miami Beach, FL 33139', '(305) 555-0100', 'https://example.com', 'Medspa', 13.50, 'free', ARRAY['botox', 'filler', 'masseter-botox'], 25.770281, -80.132717),
  ('Miami Dermatology', 'miami-dermatology', 'Miami', 'FL', '456 Brickell Ave, Miami, FL 33131', '(305) 555-0200', 'https://example.com', 'Dermatology', 14.00, 'free', ARRAY['botox', 'dysport'], 25.767931, -80.189574),
  ('Coral Gables Med Spa', 'coral-gables-med-spa', 'Miami', 'FL', '789 Miracle Mile, Coral Gables, FL 33134', '(305) 555-0300', 'https://example.com', 'Medspa', 12.50, 'free', ARRAY['botox', 'filler', 'lip-filler'], 25.749666, -80.259740)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- FUNCTIONS FOR DATA PRIVACY
-- ============================================

-- Function to delete user data (GDPR/CCPA compliance)
CREATE OR REPLACE FUNCTION delete_user_data(user_email TEXT)
RETURNS void AS $$
BEGIN
  -- Soft delete leads
  UPDATE leads
  SET deleted_at = NOW()
  WHERE email = user_email AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to permanently purge old deleted data
CREATE OR REPLACE FUNCTION purge_old_deleted_data()
RETURNS void AS $$
BEGIN
  -- Permanently delete leads deleted more than 90 days ago
  DELETE FROM leads
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify providers were created
SELECT COUNT(*) as provider_count, city 
FROM providers 
GROUP BY city 
ORDER BY city;

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('providers', 'leads');

-- Verify policies exist
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public';

-- ============================================
-- NOTES
-- ============================================
-- 
-- Security Features:
-- ✅ Row Level Security (RLS) enabled
-- ✅ Public can only read providers and insert leads
-- ✅ Only service role can modify data
-- ✅ No PHI collected in leads table
-- ✅ Soft delete with purge function
-- 
-- Data Compliance:
-- ✅ No medical history
-- ✅ No diagnoses
-- ✅ No medications
-- ✅ Only contact info and general treatment interest
-- ✅ GDPR-compliant deletion function
-- 
-- Next Steps:
-- 1. Run this entire file in Supabase SQL Editor
-- 2. Verify 9 providers were created (3 per city)
-- 3. Test lead submission from your app
-- 4. Verify RLS policies are working
-- 
-- ============================================
