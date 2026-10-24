-- Phase 1 of the price-guide build program (branch: price-report-widget).
--
-- DO NOT APPLY YET. This file is written, never applied, until the
-- price-report widget is approved for launch. It creates the two tables
-- phase 1 needs, and nothing else:
--
--   price_reports       anonymous "what did you pay" submissions, pending
--                       by default. NOTHING in this table is ever shown
--                       publicly in phase 1. Public display waits for
--                       moderation + aggregation rules (phase 4),
--                       approved separately.
--   price_report_events anonymous measurement counts (widget views and
--                       widget starts). Submission counts come from
--                       price_reports rows, not from this table.
--
-- Two submission paths (both fully anonymous, no name/email/contact):
--   quick    city + product + quantity + total. No clinic required.
--   detailed provider selected from search + the full field set.
-- A row always has a clinic OR a city (enforced below).
--
-- Display rules baked into the design (phase 4, NOT built here):
--   - Dates are stored in full but displayed as month/year only, never
--     the exact day.
--   - Never show a single person's report as "this person paid $X at
--     clinic Y". Only distributions/medians across many reports, each
--     carrying its sample size and dates.
--   - A clinic's price shows only after enough reports that no single
--     report identifies anyone. That minimum is set later with real data
--     in hand, not guessed now.
--   - No free-text fields that could identify anyone (the only free text
--     is the filler product name).
--   - Give-to-get (full guide unlocks for contributors, summary stays
--     public) is a phase-4 mechanic. Nothing is gated in phase 1.
--
-- Access: row-level security is ON with NO policies for anonymous or
-- authenticated visitors, so only the service-role key (server side)
-- can read or write these tables. That matches how leads and quiz
-- signups already write: the visitor's session client cannot insert.
--
-- No receipt upload in v1, no name, no email, no phone anywhere here.
-- Clinic rebuttal/correction fields are reserved for a later phase,
-- not built here.

CREATE TABLE IF NOT EXISTS price_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Detailed path only. NULL on the quick path (city-only reports).
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  -- Quick path: required. Detailed path: filled from the provider row.
  city TEXT CHECK (city IS NULL OR char_length(city) <= 100),
  state TEXT CHECK (state IS NULL OR char_length(state) <= 100),
  submission_path TEXT NOT NULL CHECK (submission_path IN ('quick', 'detailed')),
  product_category TEXT NOT NULL CHECK (product_category IN ('toxin', 'filler', 'biostimulator')),
  product TEXT NOT NULL CHECK (char_length(product) <= 80),
  -- One quantity column for all three categories; quantity_unit says
  -- what it counts. Toxins: units. Filler: syringes. Sculptra: vials.
  quantity NUMERIC NOT NULL CHECK (quantity > 0 AND quantity <= 1000),
  quantity_unit TEXT NOT NULL CHECK (quantity_unit IN ('units', 'syringes', 'vials')),
  total_paid NUMERIC NOT NULL CHECK (total_paid > 0 AND total_paid <= 100000),
  -- Detailed path only. Stored in full; displayed as month/year only
  -- in any later phase. NULL on the quick path.
  treatment_date DATE,
  -- Detailed path only. NULL on the quick path.
  injector_title TEXT CHECK (injector_title IN ('MD', 'DO', 'NP', 'PA', 'RN', 'other')),
  -- Detailed path only. NULL means "not asked" (quick path), never "no".
  membership_flag BOOLEAN,
  -- The #1 trust signal from the research: did the clinic tell the
  -- patient how many units they got? NULL means the visitor left it blank.
  units_disclosed_flag BOOLEAN,
  -- Outliers are flagged for moderation, never hard-rejected at submit.
  flagged_outlier BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'widget',
  moderation_note TEXT,
  CONSTRAINT price_reports_location CHECK (provider_id IS NOT NULL OR city IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS price_reports_provider_idx ON price_reports (provider_id);
CREATE INDEX IF NOT EXISTS price_reports_status_idx ON price_reports (status);
CREATE INDEX IF NOT EXISTS price_reports_city_idx ON price_reports (city);

ALTER TABLE price_reports ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS price_report_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'start')),
  page_path TEXT CHECK (char_length(page_path) <= 200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS price_report_events_type_idx ON price_report_events (event_type, created_at);

ALTER TABLE price_report_events ENABLE ROW LEVEL SECURITY;
