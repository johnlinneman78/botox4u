-- Pulse survey submissions (fix for the 2026-10-26 site audit, fail 6).
-- The old /pulse form had no backend, so submits dropped the data.
-- This table holds exactly what the form asks: city/state, per-unit
-- price, clinic name, and a 1-5 satisfaction rating. No name, email,
-- or phone is collected. RLS is on with no anonymous policy, so only
-- the service-role route (/api/pulse-submissions) can write.
CREATE TABLE IF NOT EXISTS public.pulse_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text,
  state text,
  per_unit_price numeric NOT NULL CHECK (per_unit_price > 0 AND per_unit_price <= 1000),
  clinic_name text,
  satisfaction smallint CHECK (satisfaction BETWEEN 1 AND 5),
  source text NOT NULL DEFAULT 'pulse',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pulse_submissions ENABLE ROW LEVEL SECURITY;
