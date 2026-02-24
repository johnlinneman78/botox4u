-- Clinic Audit System Table
CREATE TABLE IF NOT EXISTS clinic_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    patient_email TEXT NOT NULL,
    provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
    provider_name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    treatment_types TEXT[] DEFAULT '{}',
    primary_goal TEXT,
    price_quoted TEXT,
    found_through TEXT,
    
    -- Calculated Scores for quick access
    ii_score DECIMAL(4, 1),
    regen_ratio INTEGER,
    price_benchmark_status TEXT, 
    natural_alignment TEXT,
    
    -- Full result blob for the PDF/Email
    audit_data JSONB DEFAULT '{}'::jsonb,
    pdf_url TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending' -- 'pending', 'sent', 'failed'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clinic_audits_email ON clinic_audits(patient_email);
CREATE INDEX IF NOT EXISTS idx_clinic_audits_provider ON clinic_audits(provider_id);
CREATE INDEX IF NOT EXISTS idx_clinic_audits_created ON clinic_audits(created_at DESC);

-- RLS Policies
ALTER TABLE clinic_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert audits"
ON clinic_audits FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can manage audits"
ON clinic_audits FOR ALL
USING (auth.role() = 'service_role');

-- Add comment
COMMENT ON TABLE clinic_audits IS 'Stores personalized clinic audit requests and results for lead generation.';
