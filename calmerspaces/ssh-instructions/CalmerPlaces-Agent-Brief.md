# CalmerPlaces — Agent Execution Brief

**Purpose of this document:** This is a complete, self-contained specification for an autonomous agent with WordPress admin access to build out the CalmerPlaces website. It contains the full project context, current site state, exact tasks in dependency order, all content (categories, fields, listings, copy), the homepage design approach, and acceptance criteria. Execute tasks in the order given — later tasks depend on earlier ones.

---

## PART 1 — PROJECT CONTEXT

### What CalmerPlaces is
A verified directory of sensory-friendly places, activities, and events for autistic individuals, neurodivergent families, and anyone who needs quieter, lower-stimulation public spaces. Launch market is Portland, OR. Architecture is built to scale to other cities later, so do not hard-code Portland into anything structural (theme, category names, field names) — only into content.

### The core differentiator
Verification. Every listing reflects *real, checkable* accommodations (quiet rooms, sensory hours, trained staff, IBCCES certification, dimmed lighting, low noise), NOT generic "autism-friendly" marketing claims. This must come through in copy, in the listing detail design, and in how custom fields are surfaced.

### Domain & hosting
- Domain: calmerplaces.com
- Host: Hostinger Business Plan (LiteSpeed server, PHP 8.3)
- Owner WordPress admin email: linjojesan@gmail.com

### Primary user
A parent planning an outing for their autistic child. They are often stressed and time-pressed. Optimize every screen for fast clarity, low cognitive load, and confidence. Secondary users: autistic adults, caregivers, therapists, educators, and venue owners (who are the future monetization path).

### Brand voice
Warm, clear, respectful, specific, human. NOT clinical, NOT bureaucratic, NOT infantilizing, NOT "autism marketing." Use both identity-first ("autistic person") and person-first ("person with autism") language. Avoid clichés like "safe space," "inclusive for all," "welcoming environment" unless immediately backed by specifics. Tagline: **"The world, a little calmer."**

---

## PART 2 — CURRENT SITE STATE (as of this brief)

### WordPress
- Version: 6.9.4
- Active theme: **Astra 4.13.0** (KEEP — do not switch themes; build a child theme on top)
- Inactive themes present: Twenty Twenty-Five, Twenty Twenty-Four, Twenty Twenty-Three
- WP_MEMORY_LIMIT already raised to 256M (done)

### Active plugins (correct set — do not remove these)
- GeoDirectory 2.8.158 (the directory engine)
- AyeCode Connect 1.4.16
- UsersWP 1.2.61 (user accounts for listing owners)
- LiteSpeed Cache 7.8.1
- Hostinger Easy Onboarding, Hostinger Reach, Hostinger Tools (host utilities — harmless)

### Plugins already removed (do not reinstall)
Ninja Forms, Spectra, Starter Templates, SureForms.

### KNOWN PROBLEM: live front end still shows dental template
The homepage currently renders a leftover "Dental Clinic" Astra starter template (logo file `dental-logo05-free-img.png`, fake phone "(888) 695-9859", "Powered by Dental Clinic" footer) plus the blog feed showing two "Hello world!" placeholder posts. The site is NOT set to a static homepage. This must be fully cleaned (Part 3, Task 1).

### Existing pages (KEEP all of these — functional GeoDirectory/UsersWP pages)
Account, Add Listing (GD Add listing page), Change Password, Forgot Password, GD Archive, GD Archive Item, GD Details, Location (GD Location page), Login, Privacy Policy (currently Draft — publish it), Profile, Register, Reset Password, Search page (GD Search page), Terms and Conditions, Users, Users List Item.

### Items to DELETE
- Page: "Services" (no author, timestamp 3:07am — dental remnant)
- Posts: both "Hello world!" posts (Posts → All Posts)
- Media: the dental logo `dental-logo05-free-img.png` and any other dental/real-estate demo images in the Media Library (websitedemos.net sourced)

### NOT yet done (this brief covers all of it)
- The 7 GeoDirectory categories do not exist yet
- The 8 sensory custom fields do not exist yet
- No "Places" main landing page exists
- No real listings exist
- Homepage design not implemented
- No SEO plugin configured

---

## PART 3 — TASKS IN DEPENDENCY ORDER

### TASK 1 — Clean up dental template remnants
1. Posts → All Posts → Trash both "Hello world!" posts → Empty Trash.
2. Pages → trash the "Services" page (no-author one) → Empty Trash.
3. Appearance → Customize → Site Identity → remove the dental logo; set site title to "CalmerPlaces" and tagline to "The world, a little calmer." (Tagline can be hidden visually but set correctly for SEO.)
4. Media Library → delete `dental-logo05-free-img.png` and any websitedemos.net / real-estate / dental demo images.
5. Publish the Privacy Policy page (currently Draft). Replace its body with a standard privacy policy for a directory site that collects: visitor analytics, listing-submission form data, and user-account data via UsersWP.

**Acceptance:** Visiting calmerplaces.com shows no dental content, no Hello World posts, no fake phone number.

---

### TASK 2 — Create the 7 GeoDirectory categories
Location in admin: **GeoDirectory → Listings → Categories** (taxonomy: `gd_placecategory`). All are top-level (no parent). Create each with the exact Name, Slug, and Description below. Assign each a distinct map-pin icon color so pins are visually distinguishable on the map.

1. **Activities & Play** — slug `activities-play` — "Sensory-friendly indoor playgrounds, gyms, children's museums, and play spaces with quiet hours or sensory accommodations."
2. **Events & Programs** — slug `events-programs` — "Sensory-friendly performances, screenings, seasonal events, and structured programs for autistic and neurodivergent individuals."
3. **Restaurants & Dining** — slug `restaurants-dining` — "Restaurants and cafes with quiet hours, calm seating, sensory accommodations, or IBCCES certification."
4. **Parks & Nature** — slug `parks-nature` — "Accessible parks, sensory gardens, and quiet outdoor spaces suitable for sensory-sensitive individuals and families."
5. **Retail & Shopping** — slug `retail-shopping` — "Stores and shopping centers with sensory-friendly hours, dimmed lighting, or reduced-noise programs."
6. **Sports & Fitness** — slug `sports-fitness` — "Adaptive sports leagues, sensory-friendly swim times, gymnastics, and inclusive fitness programs."
7. **Services** — slug `services` — "Sensory-aware haircut salons, dental offices, photographers, and other providers trained to work with autistic individuals."

**Acceptance:** 7 categories exist; visiting each category archive resolves to a live URL (record the exact permalink pattern, e.g. `/places/activities-play/` — needed for Task 5).

---

### TASK 3 — Create the 8 sensory custom fields
Location: **GeoDirectory → Settings → Custom Fields** (or Places → Custom Fields depending on version). Add each as a **Checkbox** field. For each: Show in search filters = YES (this powers the differentiator); Show on detail page = YES; Show on listing card = YES for the three marked ★ (most important), optional for the rest; Required = NO.

| Label | Field key | Card? | Owner-facing help text |
|---|---|---|---|
| IBCCES Certified | `ibcces_certified` | ★ | Venue holds an IBCCES Certified Autism Center designation |
| Has Sensory Kits | `has_sensory_kits` | | Sensory kits (headphones, fidgets) available on request |
| Has Quiet Room | `has_quiet_room` | ★ | A dedicated quiet/calming space is available on-site |
| Sensory Hours Offered | `sensory_hours` | ★ | Venue runs specific reduced-stimulation hours |
| Dimmed Lighting | `dimmed_lighting` | | Lighting can be dimmed or is kept low |
| Low Noise Environment | `low_noise` | | Venue maintains a consistently low-noise environment |
| Trained Staff | `trained_staff` | | Staff have autism/sensory awareness training |
| Wheelchair Accessible | `wheelchair_accessible` | | Venue is fully wheelchair accessible |

Add one more field, type **Textarea**, key `before_you_go`, label "What to know before you go", show on detail page only — for the verification-style notes seen in the listing design.

**Acceptance:** All 9 fields appear in the Add Listing form, in the search/filter sidebar, and on listing detail pages.

---

### TASK 4 — Create the "Places" landing page + set navigation
1. Confirm/create a main directory landing page. GeoDirectory's `GD Archive` page serves as the directory home; if there is no friendly "Places" entry point, create a page titled "Places" that displays the GeoDirectory listings archive (use the GD Archive template / `[gd_archive]`-equivalent block).
2. Build the primary nav menu (Appearance → Menus): Explore (→ Places/GD Archive), How it works (→ homepage anchor), Why verified (→ homepage anchor), Add your place (→ Add Listing page), with a Login/Account link.
3. Build the footer menu mirroring the homepage footer links (the 7 categories, About, Add your place, Privacy, Terms, Accessibility).

**Acceptance:** A user can reach the full directory and every category from the nav and footer.

---

### TASK 5 — Implement the homepage as an Astra child theme
The complete homepage design (HTML/CSS) is provided as a separate file: `calmerplaces-homepage.html`. Implement it as the static front page. Recommended method:

**Build an Astra child theme** with these files:
- `style.css` — child theme header declaring Template: astra, plus paste the `<style>` block from the homepage file.
- `functions.php` — enqueue parent + child styles; register the Google Fonts (Instrument Serif + DM Sans).
- `front-page.php` — the homepage `<body>` markup from the provided file, converted to a WordPress template. Replace the hard-coded links with dynamic ones:
  - Search form action → GeoDirectory Search page URL, with the category `<select>` mapped to the `gd_placecategory` query var and the location input to GeoDirectory's location query var.
  - Each category card href → the real category archive URL from Task 2.
  - "Browse all places" → the Places/GD Archive URL.
  - "Add your place" / "List your place" buttons → Add Listing page URL.
  - Footer category links → real category URLs.
- Replace the placeholder stat numbers (47 places, 7 categories, 12 IBCCES, 100%) with either real counts pulled from GeoDirectory (`gd_placecategory` term counts) or, if zero listings exist yet, hide the stats bar until there are ≥10 listings. DO NOT show inflated fake counts — it undermines the verification brand.

Then: Settings → Reading → "Your homepage displays" → A static page → select the homepage. (If using `front-page.php`, WordPress will use it automatically once a static front page is set.)

**Design system reference (for any extension/consistency):**
- Fonts: Instrument Serif (display/headings, use italic for emphasis words), DM Sans (body/UI).
- Colors: teal `#0f4a52` (primary), teal-mid `#1a6b77`, teal-light `#2a8a99`, amber `#e8a53a` (accent/CTAs), ink `#0d1f22` (dark sections), mist `#f5f9fa` (alt background), teal-wash `#e8f4f6` (icon backgrounds), sage `#4a7c6b`. Borders `#d8e8ea`.
- Buttons: teal fill for primary, amber fill for the main search CTA, outlined for secondary.
- Cards: white, 1px border `#d8e8ea`, 14px radius, lift + teal bottom-border reveal on hover.
- Tags/pills: rounded 100px; teal-wash for standard, amber-light for IBCCES/verified, sage-light for staff-related.
- Keep WCAG AA contrast. Teal `#0f4a52` on white passes; amber is an accent only (not for body text on white).

**Acceptance:** calmerplaces.com loads the new design; search submits into GeoDirectory; all category cards resolve to real category pages; no broken links; mobile responsive.

---

### TASK 6 — Style the GeoDirectory inner pages to match
GeoDirectory's archive, search, and detail pages will inherit Astra defaults and look disconnected from the homepage. Add CSS (via child theme or Customizer Additional CSS) to bring the directory pages in line with the design system: same fonts, teal headers, the tag/pill styling for the sensory custom fields, and a verification-forward listing card (IBCCES badge prominent, "What to know before you go" section styled as in the homepage's listing-detail example).

**Acceptance:** Clicking from homepage into the directory feels like the same product.

---

### TASK 7 — Seed the first real Portland listings
Add the listings below via GeoDirectory → Add New Place. CRITICAL: every accommodation checkbox and every detail must be VERIFIED against the venue's current, real offerings before publishing — the brand's entire value is accuracy. If a detail cannot be confirmed, leave that checkbox unchecked rather than guessing. Research each venue's official site / current programming at build time (programs change). Treat the data below as starting research targets, not confirmed facts.

Seed targets (research & verify each):
1. **We Rock the Spectrum** (sensory gym) — Activities & Play. Likely: quiet room, sensory kits, all-abilities equipment, trained staff. Verify IBCCES status.
2. **AMC (Portland-area location)** — Events & Programs. AMC Sensory Friendly Films program (lowered volume, raised lights, typically scheduled showings). Verify current schedule.
3. **OMSI (Oregon Museum of Science and Industry)** — Activities & Play / Events. Verify current sensory-friendly programming.
4. **Portland Children's Museum / current equivalent** — Activities & Play. Verify status (it has had closures/changes — confirm it's operating).
5. **Target (Portland locations)** — Retail & Shopping. National sensory-friendly hours program — verify current participation and hours.
6. **Chuck E. Cheese (Portland-area)** — Activities & Play. National Sensory Sensitive Sundays program — verify locations.
7. **A sensory-friendly dentist in Portland** — Services. Search and verify one with explicit sensory/autism accommodations.
8. **Leach Botanical Garden** — Parks & Nature. Verify low-noise/accessibility claims before tagging.
9. **An adaptive swim or gymnastics program** — Sports & Fitness. Verify a current Portland program.
10. **A relaxed-performance theater or sensory event venue** — Events & Programs. Verify current Portland offerings.

For each listing capture: name, category, full address (GeoDirectory geocodes it), phone, website, a specific plain-language description, the verified custom-field checkboxes, and a "What to know before you go" note with concrete details (days/times, what to expect).

**Acceptance:** At least 10 verified listings published, each with accurate custom-field tags and a specifics-rich description. Update Task 5 stat numbers to reflect the real count.

---

### TASK 8 — SEO foundation
1. Install one SEO plugin — RankMath or Yoast (the site already references rank-math breadcrumbs in theme features, so **RankMath** is the natural choice).
2. Set meta titles/descriptions for the homepage and each of the 7 category pages using the keyword targets in Part 4.
3. Verify the site in Google Search Console; submit an XML sitemap.
4. Install analytics (Plausible preferred for privacy-first; or GA4).
5. Ensure GeoDirectory's location + category pages have clean, indexable URLs and unique meta.

**Acceptance:** Homepage and category pages have unique, keyword-aligned titles/descriptions; sitemap submitted to GSC.

---

### TASK 9 — LiteSpeed cache config (Hostinger-specific)
LiteSpeed Cache can conflict with GeoDirectory's AJAX map/search. Exclude GeoDirectory's dynamic pages (search, archive, location) from full-page caching, or enable ESI/exclusions per AyeCode's GeoDirectory + LiteSpeed guidance. Verify the map renders and search returns fresh results after enabling cache.

**Acceptance:** Cache is on, but directory search/map work correctly.

---

## PART 4 — SEO KEYWORD TARGETS

Map these to pages. Head terms → homepage + category pages. Long-tail → future blog posts.

**Tier 1 (head terms):**
- autism friendly activities near me (590/mo)
- autism activities near me (590/mo)
- sensory friendly activities near me (390/mo)
- sensory places near me (320/mo)
- autism friendly activities (110/mo)
- sensory friendly places near me (110/mo)
- sensory activities near me (90/mo)

**Tier 2 (sub-niche → category pages):**
- autism friendly birthday party places (70) → Activities & Play
- sensory rooms for autism near me (50) → Activities & Play
- autism friendly sports near me (30) → Sports & Fitness
- sensory friendly shopping (30) → Retail & Shopping

**Tier 3 (blog article topics, not directory pages):**
sensory friendly movies · sensory friendly santa · autism friendly vacations · ibcces certified autism center · sensory friendly mall · sensory friendly hours target

**Homepage meta (draft):**
- Title: `Sensory-Friendly Places in Portland | CalmerPlaces`
- Description: `A verified directory of sensory-friendly activities, restaurants, and places for autistic kids and neurodivergent families in Portland, OR. Real accommodations, checked — not just claims.`

---

## PART 5 — HOMEPAGE COPY (final, use verbatim)

- **Hero headline:** Places that *actually get it.*
- **Hero subheadline:** A verified directory of sensory-friendly venues for autistic kids, neurodivergent families, and anyone who needs the world turned down a little.
- **Hero trust line:** Every listing checked · Real accommodations, not claims · Free to use
- **Search CTA button:** Search CalmerPlaces →
- **Categories section intro:** Where does your family need to go today? — Every category filtered for genuine sensory accommodations, not marketing claims.
- **How it works:** Know before you go. — Planning an outing shouldn't require three phone calls and a gamble. We've done that work for you. (Steps: 01 Search your area / 02 Read the real details / 03 Go with confidence.)
- **Verified section:** Verified means we checked. Every time. — Anyone can put "autism-friendly" on a website. We only list places where we've confirmed what they actually offer — so you're not finding out on arrival that it wasn't what you hoped.
- **Venue CTA:** Run a place that welcomes sensory-sensitive guests? — If you've invested in real accommodations — trained staff, quiet hours, a calm space — families need to find you. Listing your place is free, and always will be.
- **Footer brand line:** The world, a little calmer.

---

## PART 6 — DO / DON'T FOR THE AGENT

**DO**
- Keep Astra; build a child theme (survives theme updates).
- Verify every listing's accommodations against current real sources before publishing.
- Hide or zero-out stat counters until real listings back them.
- Preserve all GeoDirectory/UsersWP pages.
- Use the exact category slugs and field keys given (other tasks/links depend on them).
- Keep WCAG AA contrast; amber is accent-only on white.

**DON'T**
- Don't switch themes or reinstall the removed plugins.
- Don't invent or inflate listing data, counts, or certifications.
- Don't hard-code "Portland" into theme/category/field structure (city expansion later).
- Don't let LiteSpeed cache break GeoDirectory search/map.
- Don't use clichés ("safe space," "inclusive for all") or clinical/infantilizing language in any copy.
- Don't publish the homepage with dead category links — categories (Task 2) must exist first.

---

## PART 7 — EXECUTION ORDER SUMMARY
1. Clean dental remnants → 2. Create 7 categories → 3. Create 9 custom fields → 4. Places page + nav/footer menus → 5. Child theme homepage (wire links to real category URLs from step 2) → 6. Style inner directory pages → 7. Seed 10+ verified listings → 8. SEO + GSC + analytics → 9. LiteSpeed exclusions.

Tasks 1–4 are prerequisites for 5. Task 7 can run in parallel with 5–6. Tasks 8–9 are finishing.
