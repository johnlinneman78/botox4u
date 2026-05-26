#!/usr/bin/env bash
# ============================================================
# CalmerPlaces — WP-CLI execution script
# For the agent with SSH/WP-CLI access to calmerplaces.com
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
for ID in $(wp post list --post_type=post --name=hello-world --field=ID; wp post list --post_type=post --name=hello-world-2 --field=ID); do
  [ -n "$ID" ] && wp post delete "$ID" --force
done

echo "==> 1b. Deleting leftover 'Services' dental page (ID 312)"
wp post delete 312 --force

echo "==> 1c. Set site title + tagline"
wp option update blogname "CalmerPlaces"
wp option update blogdescription "The world, a little calmer."

# ------------------------------------------------------------
# TASK 2 — Create the 7 GeoDirectory categories
# Taxonomy: gd_placecategory
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

# ------------------------------------------------------------
# TASK 5 — Child theme activation
# ------------------------------------------------------------
echo "==> 5. Activating child theme"
wp theme activate calmerplaces-child

echo "==> 5b. Set a static front page"
HOME_ID=$(wp post list --post_type=page --name=home --field=ID)
if [ -z "$HOME_ID" ]; then
  HOME_ID=$(wp post create --post_type=page --post_title="Home" --post_status=publish --porcelain)
fi
wp option update show_on_front "page"
wp option update page_on_front "$HOME_ID"
echo "  Front page set to page ID $HOME_ID (front-page.php template will render it)"

# ------------------------------------------------------------
# TASK 8 — Flush rewrite rules
# ------------------------------------------------------------
echo "==> Flushing permalinks"
wp rewrite flush --hard

echo "==> DONE (scriptable portion)"
