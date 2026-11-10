-- Second-opinion ruling 6 (ruled Nov 7, 2026; approved Nov 9, 2026):
-- clinic-posted prices are a separate labeled source, displayed as
-- "Price posted by the clinic" with its date. Dashboard and claim
-- price writes move to these columns (see
-- lib/actions/provider-actions.ts). A posted price earns the 10
-- pricing points like any published per-unit price (lib/scoring.ts);
-- no weight change. Nothing here touches price_per_unit, which keeps
-- holding seed/menu prices.
alter table providers
  add column if not exists clinic_posted_price_per_unit numeric,
  add column if not exists clinic_posted_price_at timestamptz;
