-- Create patients table for newsletter and lead tracking
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    city TEXT,
    state TEXT,
    newsletter_opt_in BOOLEAN DEFAULT FALSE,
    last_lead_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Active leads can also be tracked here for re-marketing
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_newsletter ON patients(newsletter_opt_in) WHERE newsletter_opt_in = TRUE;
