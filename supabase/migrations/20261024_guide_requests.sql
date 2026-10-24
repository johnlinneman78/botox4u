-- Guide opt-in for the price-report widget (branch: guide-opt-in).
--
-- When a visitor submits a price AND checks "Send me the free pricing
-- guide", their email is saved here — and ONLY here. This table is
-- deliberately NOT linked to price_reports (no report id, no join):
-- the price stays anonymous even when the visitor opts in, and the
-- email is used only to send the guide, never to identify a report.
--
-- Access: row-level security is ON with NO policies for anonymous or
-- authenticated visitors, so only the service-role key (server side)
-- can read or write this table — the same pattern as price_reports,
-- leads, and quiz signups.
--
-- What gets sent, and when (owner's decision, Oct 24): HOLD. Requests
-- are saved now; contributors get first access when the full guide
-- launches (phase 4). This migration only stores the request; it
-- sends nothing.

CREATE TABLE IF NOT EXISTS guide_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL CHECK (char_length(email) <= 254),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'widget'
);

ALTER TABLE guide_requests ENABLE ROW LEVEL SECURITY;
