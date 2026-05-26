#!/usr/bin/env bash
# ============================================================
# CalmerPlaces — WP-CLI execution script
# For the agent with SSH/WP-CLI access to calmerplaces.com
#
# IMPORTANT:
# - Run from the WordPress root (where wp-config.php lives).
# - Take a Hostinger backup snapshot BEFORE running.
# - These cover the SCRIPTABLE tasks. GeoDirectory custom fields
#   (Task 3) and listing creation (Task 7) are safest via the GD
#   admin UI because they rely on GD's internal hooks — see notes.
# - After running, VERIFY in wp-admin that categories appear in the
#   GeoDirectory UI (not just as taxonomy terms).
# ============================================================

set -e

echo "==> 0. Sanity check"
wp core version
wp theme list
wp plugin list --status=active

# ------------------------------------------------------------
# TASK 1 — Clean dental remnants
# ------------------------------------------------------------
echo "==> 1. Deleting 'Hello world!' posts"
# Find and delete posts titled 'Hello world!' (both)
for ID in $(wp post list --post_type=post --name=hello-world --field=ID; wp post list --post_type=post --name=hello-world-2 --field=ID); do
  [ -n "$ID" ] && wp post delete "$ID" --force
done

echo "==> 1b. Deleting leftover 'Services' dental page (verify ID first!)"
# List pages so the agent can confirm the right 'Services' page ID before deleting.
wp post list --post_type=page --fields=ID,post_title,post_status
# Then, after confirming the dental 'Services' page ID (the one with no author):
# wp post delete <SERVICES_PAGE_ID> --force

echo "==> 1c. Set site title + tagline"
wp option update blogname "CalmerPlaces"
wp option update blogdescription "The world, a little calmer."

# ------------------------------------------------------------
# TASK 2 — Create the 7 GeoDirectory categories
# Taxonomy: gd_placecategory  (VERIFY taxonomy name on this install:
#   wp taxonomy list | grep -i place )
# ------------------------------------------------------------
echo "==> 2. Creating GeoDirectory categories"
TAX="gd_placecategory"

wp term create $TAX "Activities & Play"    --slug="activities-play"    --description="Sensory-friendly indoor playgrounds, gyms, children's museums, and play spaces with quiet hours or sensory accommodations." || true
wp term create $TAX "Events & Programs"    --slug="events-programs"    --description="Sensory-friendly performances, screenings, seasonal events, and structured programs for autistic and neurodivergent individuals." || true
wp term create $TAX "Restaurants & Dining" --slug="restaurants-dining" --description="Restaurants and cafes with quiet hours, calm seating, sensory accommodations, or IBCCES certification." || true
wp term create $TAX "Parks & Nature"       --slug="parks-nature"       --description="Accessible parks, sensory gardens, and quiet outdoor spaces suitable for sensory-sensitive individuals and families." || true
wp term create $TAX "Retail & Shopping"    --slug="retail-shopping"    --description="Stores and shopping centers with sensory-friendly hours, dimmed lighting, or reduced-noise programs." || true
wp term create $TAX "Sports & Fitness"     --slug="sports-fitness"     --description="Adaptive sports leagues, sensory-friendly swim times, gymnastics, and inclusive fitness programs." || true
wp term create $TAX "Services"             --slug="services"           --description="Sensory-aware haircut salons, dental offices, photographers, and other providers trained to work with autistic individuals." || true

wp term list $TAX --fields=term_id,name,slug,count
# NOTE: wp term create makes the taxonomy term, but GeoDirectory category
# ICONS/colors are GD meta — set those in GeoDirectory → Listings → Categories UI.

# ------------------------------------------------------------
# TASK 3 — Custom fields  (DO IN GEODIRECTORY UI)
# GD custom fields live in GD's own tables and require its admin
# flow to register search/detail behavior correctly. Create the 9
# fields (8 checkboxes + 1 textarea 'before_you_go') via:
#   GeoDirectory → Settings → Custom Fields
# Field keys must match the brief exactly.
# ------------------------------------------------------------
echo "==> 3. (Manual) Create custom fields in GeoDirectory UI — see brief Task 3."

# ------------------------------------------------------------
# TASK 5 — Child theme activation
# (Upload the calmerplaces-child folder to wp-content/themes/ first,
#  via SSH/SFTP, then:)
# ------------------------------------------------------------
echo "==> 5. Activating child theme (after files uploaded)"
wp theme list | grep -i calmerplaces || echo "  (upload calmerplaces-child to wp-content/themes/ first)"
# wp theme activate calmerplaces-child

echo "==> 5b. Set a static front page"
# Create a Home page if one doesn't exist, then set it as front page.
HOME_ID=$(wp post list --post_type=page --name=home --field=ID)
if [ -z "$HOME_ID" ]; then
  HOME_ID=$(wp post create --post_type=page --post_title="Home" --post_status=publish --porcelain)
fi
wp option update show_on_front "page"
wp option update page_on_front "$HOME_ID"
echo "  Front page set to page ID $HOME_ID (front-page.php template will render it)"

# ------------------------------------------------------------
# TASK 8 — Flush rewrite rules after taxonomy/permalink changes
# ------------------------------------------------------------
echo "==> Flushing permalinks"
wp rewrite flush --hard

echo "==> DONE (scriptable portion). Now in wp-admin:"
echo "   - Confirm categories show in GeoDirectory UI + set icons"
echo "   - Create the 9 custom fields (Task 3)"
echo "   - Verify front-page.php CONFIG URLs match real category permalinks"
echo "   - Seed listings (Task 7) via GD Add New Place, verifying each"
