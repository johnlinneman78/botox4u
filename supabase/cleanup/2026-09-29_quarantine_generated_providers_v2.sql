-- ============================================================================
-- Quarantine generated providers, v2
-- v1 assumed generated rows had no google_place_id. They do: an enrichment
-- script looked up each invented name on Google and stored whatever came back,
-- so e.g. "Facial Concepts of <city>" shows 4.9 / 254 reviews in six cities.
--
-- This version finds generated rows by their own fingerprints:
--   A. one of the 20 generic names the scripts used, combined with a city
--      prefix ("NYC ...", "Los Angeles ...") or suffix ("... of Boston")
--   B. "<City> <Word> <number>" names, e.g. "New York Dermatology 36"
--   C. a website containing a space (built by string concatenation)
--   D. a google_place_id shared by 2+ providers with different names
--      (a real Google listing belongs to one business)
-- Paid/claimed rows are never moved automatically.
--
-- Run with psql, ONE STEP AT A TIME:
--   psql "$env:DATABASE_URL" -f <file-with-one-step>
-- ============================================================================


-- STEP 1. Backup (skip if providers_backup_20260928 already exists) ---------
CREATE TABLE IF NOT EXISTS providers_backup_20260928 AS SELECT * FROM providers;
SELECT count(*) AS backed_up FROM providers_backup_20260928;


-- STEP 2. Build the candidate list (read-only view) -------------------------
CREATE OR REPLACE VIEW generated_provider_candidates WITH (security_invoker = true) AS
WITH shared_pid AS (
  SELECT google_place_id
  FROM providers
  WHERE google_place_id IS NOT NULL
  GROUP BY google_place_id
  HAVING count(DISTINCT lower(name)) > 1
),
flags AS (
  SELECT p.id, p.name, p.city, p.state, p.website, p.google_place_id,
         p.rating, p.review_count, p.listing_tier, p.outreach_status,
         (p.name ~* '(Elite Med Spa|Glow Aesthetics|Renew Medical Spa|Serenity MedSpa|Vitality Medical|Radiance Skin Lab|Pure Bliss Med Spa|Advanced Skin & Body|The Aesthetic Clinic|Infinity MedSpa|Luxe Med Spa|Rejuvenate Med Spa|Skin Clinic & Laser|Beauty Bar & Med Spa|Modern Aesthetics|Facial Concepts|Avenue Aesthetics|Skyline Medspa|Metropolitan Injectables|Empire Beauty)'
          AND (p.name ~* (' of ' || p.city || '$')
               OR p.name ~* ('^' || p.city || ' ')
               OR p.name ~* '^NYC '))                            AS a_generic_name,
         (p.name ~ ' [0-9]{1,3}$'
          AND (p.name ~* ('^' || p.city || ' ') OR p.name ~* '^NYC ')) AS b_numbered_name,
         (p.website ~ ' ')                                        AS c_space_in_website,
         (p.google_place_id IN (SELECT google_place_id FROM shared_pid)) AS d_shared_place_id
  FROM providers p
)
SELECT *,
       (coalesce(listing_tier,'free') <> 'free'
        OR outreach_status IN ('claimed','paying'))               AS protected
FROM flags
WHERE a_generic_name OR b_numbered_name OR c_space_in_website OR d_shared_place_id;


-- STEP 3. Review (read-only) ------------------------------------------------
-- 3a. How many rows each rule catches, and the total
SELECT count(*)                                    AS total_candidates,
       count(*) FILTER (WHERE a_generic_name)      AS a_generic_name,
       count(*) FILTER (WHERE b_numbered_name)     AS b_numbered_name,
       count(*) FILTER (WHERE c_space_in_website)  AS c_space_in_website,
       count(*) FILTER (WHERE d_shared_place_id)   AS d_shared_place_id,
       count(*) FILTER (WHERE protected)           AS protected_not_moved
FROM generated_provider_candidates;

-- 3b. Rows caught ONLY by rule D (shared place ID). These are the ones most
--     likely to include a real clinic, e.g. two locations of one chain that
--     Google lists once. Read this list line by line.
SELECT name, city, state, website, rating, review_count
FROM generated_provider_candidates
WHERE d_shared_place_id AND NOT (a_generic_name OR b_numbered_name OR c_space_in_website)
ORDER BY google_place_id, city, name;

-- 3c. By city
SELECT city, state, count(*) AS candidates
FROM generated_provider_candidates
GROUP BY city, state
ORDER BY candidates DESC;

-- 3d. Protected rows (paid or claimed): never moved automatically
SELECT id, name, city, listing_tier, outreach_status
FROM generated_provider_candidates
WHERE protected;


-- STEP 4. Quarantine. Only after John approves step 3 -----------------------
-- To spare a real clinic that step 3b listed, add its id to the NOT IN list.
BEGIN;

CREATE TABLE IF NOT EXISTS providers_quarantine AS
SELECT *, now() AS quarantined_at, ''::text AS quarantine_reason
FROM providers WHERE false;

INSERT INTO providers_quarantine
SELECT p.*, now(),
       concat_ws(', ',
         CASE WHEN c.a_generic_name     THEN 'generic generated name' END,
         CASE WHEN c.b_numbered_name    THEN 'numbered generated name' END,
         CASE WHEN c.c_space_in_website THEN 'space in website' END,
         CASE WHEN c.d_shared_place_id  THEN 'place_id shared with other names' END)
FROM providers p
JOIN generated_provider_candidates c ON c.id = p.id
WHERE NOT c.protected
  AND p.id NOT IN ('00000000-0000-0000-0000-000000000000');   -- ids to spare go here

DELETE FROM providers p
USING providers_quarantine q
WHERE p.id = q.id;

-- quarantined should equal 3a total_candidates minus protected_not_moved
-- (minus any ids you spared). If not: ROLLBACK; instead of COMMIT;
SELECT (SELECT count(*) FROM providers)            AS remaining,
       (SELECT count(*) FROM providers_quarantine) AS quarantined_total;

COMMIT;


-- STEP 5. Clear made-up values on rows that stay ----------------------------
UPDATE providers SET price_per_unit = NULL
WHERE city = 'Portland' AND state = 'OR' AND price_per_unit = 14;

UPDATE providers SET hero_image_url = NULL
WHERE hero_image_url LIKE '%images.unsplash.com%';


-- STEP 6. Outreach check ----------------------------------------------------
SELECT outreach_status, count(*) FROM providers_quarantine GROUP BY outreach_status;


-- STEP 7. Tidy up -----------------------------------------------------------
DROP VIEW IF EXISTS generated_provider_candidates;


-- Restoring one row later (replace the id):
-- INSERT INTO providers
-- SELECT (jsonb_populate_record(NULL::providers,
--         to_jsonb(q) - 'quarantined_at' - 'quarantine_reason')).*
-- FROM providers_quarantine q WHERE q.id = '<id>';
-- DELETE FROM providers_quarantine WHERE id = '<id>';
