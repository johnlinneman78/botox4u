-- ============================================================================
-- Quarantine generated and unconfirmed providers
-- Run in the Supabase SQL editor, ONE STEP AT A TIME, reading each result.
--
-- Background: scripts that have since been deleted (add_ny_providers.js,
-- add_missing_tier1.js, populate_portland.js and at least one other) inserted
-- providers with invented names, street addresses, ratings, review counts,
-- $14/unit prices, stock photos and random map coordinates. None of them set
-- google_place_id.
--
-- Rule used here: a provider stays public only if it has a google_place_id
-- (it matched a real Google listing) OR npi_verified = true.
-- Everything else moves to providers_quarantine. Nothing is lost: step 6
-- shows how to restore a row.
-- ============================================================================


-- STEP 1. Full backup (cheap insurance) ------------------------------------
CREATE TABLE IF NOT EXISTS providers_backup_20260928 AS
SELECT * FROM providers;

SELECT count(*) AS backed_up FROM providers_backup_20260928;


-- STEP 2. Look before you move anything ------------------------------------
-- 2a. Totals
SELECT
  count(*)                                                        AS total,
  count(*) FILTER (WHERE google_place_id IS NOT NULL)             AS has_place_id,
  count(*) FILTER (WHERE npi_verified IS TRUE)                    AS npi_verified,
  count(*) FILTER (WHERE google_place_id IS NULL
                     AND npi_verified IS NOT TRUE)                AS to_quarantine
FROM providers;

-- 2b. The generated-name pattern specifically (the 20 names the scripts used)
SELECT city, state, count(*) AS generated_rows
FROM providers
WHERE google_place_id IS NULL
  AND name ~* '(Elite Med Spa|Glow Aesthetics|Renew Medical Spa|Serenity MedSpa|Vitality Medical|Radiance Skin Lab|Pure Bliss Med Spa|Advanced Skin & Body|The Aesthetic Clinic|Infinity MedSpa|Luxe Med Spa|Rejuvenate Med Spa|Skin Clinic & Laser|Beauty Bar & Med Spa|Modern Aesthetics|Facial Concepts|Avenue Aesthetics|Skyline Medspa|Metropolitan Injectables|Empire Beauty)'
GROUP BY city, state
ORDER BY generated_rows DESC;

-- 2c. Everything that would be quarantined, by city (skim for real clinics
--     you recognise; they can be restored and re-matched later)
SELECT city, state, count(*) AS rows_without_confirmation
FROM providers
WHERE google_place_id IS NULL AND npi_verified IS NOT TRUE
GROUP BY city, state
ORDER BY rows_without_confirmation DESC;

-- 2d. Anyone paying or claimed must NOT be moved without a human look
SELECT id, name, city, listing_tier, outreach_status
FROM providers
WHERE google_place_id IS NULL AND npi_verified IS NOT TRUE
  AND (coalesce(listing_tier, 'free') <> 'free'
       OR outreach_status IN ('claimed', 'paying'));


-- STEP 3. Quarantine --------------------------------------------------------
-- Leads keep their row (their provider_id is set to NULL by the FK).
-- Practitioner and enrichment-queue rows for these providers are deleted by
-- ON DELETE CASCADE; they belong to rows that don't exist in the real world.
BEGIN;

CREATE TABLE IF NOT EXISTS providers_quarantine AS
SELECT *, now() AS quarantined_at, 'no place_id and no NPI match'::text AS quarantine_reason
FROM providers
WHERE false;

INSERT INTO providers_quarantine
SELECT p.*, now(), 'no place_id and no NPI match'
FROM providers p
WHERE p.google_place_id IS NULL
  AND p.npi_verified IS NOT TRUE
  AND coalesce(p.listing_tier, 'free') = 'free'
  AND coalesce(p.outreach_status, '') NOT IN ('claimed', 'paying');

DELETE FROM providers p
USING providers_quarantine q
WHERE p.id = q.id;

-- quarantined should equal step 2a's to_quarantine minus the rows step 2d
-- listed. If it doesn't, run ROLLBACK; instead of COMMIT;
SELECT (SELECT count(*) FROM providers)            AS remaining,
       (SELECT count(*) FROM providers_quarantine) AS quarantined;

COMMIT;


-- STEP 4. Remove made-up values from rows that stay -------------------------
-- populate_portland.js set price_per_unit = 14 on every Portland row and used
-- Unsplash stock photos as clinic "hero" images.
UPDATE providers
SET price_per_unit = NULL
WHERE city = 'Portland' AND state = 'OR' AND price_per_unit = 14;

UPDATE providers
SET hero_image_url = NULL
WHERE hero_image_url LIKE '%images.unsplash.com%';


-- STEP 5. Did outreach go to generated rows? --------------------------------
SELECT outreach_status, count(*)
FROM providers_quarantine
GROUP BY outreach_status;
-- Anything other than 'not_sent' / NULL here means emails went to made-up
-- addresses. Check Resend's logs for bounces from those sends.


-- STEP 6. Restoring a real clinic that got caught ---------------------------
-- Look it up in providers_quarantine, then (replace the id):
--
-- INSERT INTO providers
-- SELECT (jsonb_populate_record(NULL::providers,
--         to_jsonb(q) - 'quarantined_at' - 'quarantine_reason')).*
-- FROM providers_quarantine q
-- WHERE q.id = '00000000-0000-0000-0000-000000000000';
--
-- DELETE FROM providers_quarantine WHERE id = '00000000-0000-0000-0000-000000000000';
--
-- Then add its google_place_id (or confirm its NPI) so it stays public.
