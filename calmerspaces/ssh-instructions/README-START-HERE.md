# CalmerPlaces — START HERE (Agent Orientation)

**Read this first.** It explains what you're building, what each file in this package is, why each step exists, and the exact order to do things. The other documents are execution detail; this is the map.

---

## 1. What you are building, in one paragraph

CalmerPlaces is a **verified directory of sensory-friendly places** (restaurants, parks, activities, etc.) for autistic kids and neurodivergent families, launching in Portland, OR. It runs on **WordPress + the GeoDirectory plugin** on Hostinger. GeoDirectory is the engine that stores listings, draws the map, and powers search/filter. Your job is to (a) clean up leftover demo content, (b) configure GeoDirectory with the right categories and sensory-accommodation filter fields, (c) install a custom homepage design, and (d) seed the first real listings. The entire product's value rests on one thing: **listings are verified, not generic "autism-friendly" marketing claims.** Protect that at every step.

## 2. Why this exists / the strategy (so you can make good judgment calls)

- The differentiator is **verification**. Every accommodation shown (quiet room, sensory hours, IBCCES certification, etc.) must be real and checkable. If you ever have to choose between "looks complete" and "is accurate," choose accurate. Never invent a listing detail or certification.
- The owner explicitly wants to **validate demand before polishing** — so the priority order is: working directory + real listings FIRST, visual perfection SECOND. Don't spend hours on design refinements while there are zero listings.
- The site will **expand to other cities later**, so nothing structural (theme, category names, field keys) should hard-code "Portland." Only content mentions Portland.

## 3. The files in this package and what each is for

| File | What it is | Why it exists |
|---|---|---|
| **README (this file)** | Orientation + execution order | So you understand the *why*, not just the *what* |
| **CalmerPlaces-Agent-Brief.md** | The full spec: 9 tasks, all content, acceptance criteria, do/don'ts | The authoritative source of truth. Every task detail lives here. |
| **calmerplaces-homepage.html** | Standalone reference design of the homepage | Visual reference + the source the child theme was built from. Open in a browser to see the target look. |
| **calmerplaces-child.zip** | Ready-to-install Astra child theme (style.css, functions.php, front-page.php) | The homepage, built as proper WordPress code so you don't have to construct it. Upload this rather than hand-coding. |
| **calmerplaces-child/** (loose files) | Same theme, unzipped | Use these if you're writing files directly over SSH instead of uploading a zip. |
| **calmerplaces-wpcli.sh** | WP-CLI command script | Automates the scriptable tasks (delete demo posts, create categories, set homepage). Read the inline comments — they flag what must be verified vs. what's safe. |

## 4. Why the work is split between "scripted" and "manual UI"

Some tasks are safe to script with WP-CLI (deleting posts, creating taxonomy terms, setting options). **Two tasks are deliberately left for the GeoDirectory admin UI:**

- **Custom fields (Brief Task 3)** — GeoDirectory stores these in its own tables and wires them into search/detail views through internal hooks. Creating them by raw DB insert produces fields that don't actually filter or display. Use the GD UI.
- **Listings (Brief Task 7)** — same reason, plus each one needs human verification of real accommodations. Use GD → Add New Place.

If you script something GD-related, **always verify in the GeoDirectory UI afterward** that it actually appears and functions — not just that the database row exists.

## 5. EXECUTION ORDER (do not reorder — later steps depend on earlier)

```
STEP 0  Take a Hostinger backup snapshot (hPanel → Files → Backups).
        Everything after this is reversible if you have a restore point.

STEP 1  Run calmerplaces-wpcli.sh sections for Task 1:
        delete Hello World posts, set site title/tagline.
        Manually confirm the dental "Services" page ID before deleting it.

STEP 2  Run the Task 2 section: create the 7 categories.
        THEN open GeoDirectory → Listings → Categories in wp-admin and
        confirm all 7 appear; set a distinct map-pin icon/color for each.

STEP 3  In GeoDirectory UI: create the 9 custom fields (Brief Task 3).
        Field keys MUST match the brief exactly — front-page.php and
        future filtering depend on them.

STEP 4  Create the "Places" landing page + build nav and footer menus
        (Brief Task 4).

STEP 5  Upload the child theme:
        - Put calmerplaces-child/ into wp-content/themes/ (SSH/SFTP), OR
          upload calmerplaces-child.zip via Appearance → Themes → Add New.
        - DO NOT activate yet.

STEP 6  Get the REAL category permalinks (from Step 2) and the REAL
        GD search form field names. Open front-page.php and update the
        CONFIG block at the top:
          - search_url, archive_url, add_listing_url, login_url
          - cat_query_var / loc_query_var  ← inspect the live GD Search
            page's form to get the exact input "name" attributes; the
            defaults (spincl/snear) vary by GD version. THIS IS THE #1
            THING THAT BREAKS — verify it.
          - the 7 category URLs
        Then run the wpcli Task 5 section to set the static front page,
        and activate the theme: wp theme activate calmerplaces-child

STEP 7  Verify the live homepage renders front-page.php (not a blank
        Astra page). Click every category card — each must resolve to a
        real category page, no 404s. Submit the search form — it must
        land on GD results, not an error.

STEP 8  Style the GD inner pages to match (Brief Task 6) — optional
        polish; can wait until listings exist.

STEP 9  Seed 10+ verified Portland listings (Brief Task 7), verifying
        each venue's real accommodations. Then the stats bar will
        auto-appear (it's hidden below 10 listings by design).

STEP 10 SEO + LiteSpeed cache config (Brief Tasks 8–9).
```

## 6. The three things most likely to go wrong (and how the code guards them)

1. **Search form doesn't work** — because the GD search field names differ from the defaults in front-page.php's CONFIG. Fix: inspect the real GD Search page form, copy the exact `name=""` attributes into `cat_query_var` / `loc_query_var`.
2. **Homepage shows fake stats** — guarded: the stats bar is CSS-hidden and the counts pull live from the database, so it won't show inflated numbers. Don't manually re-add fake numbers.
3. **Homepage CSS breaks other pages** — guarded: all homepage CSS is namespaced under `.cp-home`, so it can't leak into GeoDirectory or Astra pages. Don't remove that scoping.

## 7. Acceptance — you are done when

- calmerplaces.com shows the CalmerPlaces homepage (no dental content anywhere).
- All 7 categories exist, have icons, and resolve to live pages.
- All 9 custom fields appear in Add Listing, in search filters, and on detail pages.
- Homepage search submits into a working GeoDirectory results page.
- 10+ real, verified listings are published, each with accurate accommodation tags.
- No broken links; mobile responsive; cache on but directory search/map still work.

## 8. If you get stuck

Report back the specific failure (a screenshot of the live result is ideal) rather than guessing — especially for anything touching the GeoDirectory search form, the child theme activation, or listing data accuracy. Those three are where wrong guesses cost the most.
