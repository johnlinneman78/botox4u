<?php
/**
 * Front Page Template â€” CalmerPlaces
 *
 * WordPress uses this automatically when a static front page is set
 * (Settings â†’ Reading â†’ "Your homepage displays" â†’ A static page).
 *
 * ============================================================
 * CONFIG â€” EDIT THESE AFTER THE GEODIRECTORY PAGES/CATEGORIES EXIST
 * ============================================================
 * Fill these with the REAL URLs from this install. The category URLs
 * come from Task 2 (after the 7 categories are created). If your
 * permalink base differs, adjust accordingly.
 *
 * To verify a category URL: create the category, then visit its
 * archive and copy the resulting permalink (often /places/<slug>/).
 */

$CP = array(
	// Core GeoDirectory / account pages
	'search_url'      => home_url( '/search/' ),        // GD Search page â€” VERIFY slug
	'archive_url'     => home_url( '/places/' ),        // GD Archive / all places â€” VERIFY slug
	'add_listing_url' => home_url( '/add-listing/' ),   // GD Add Listing page â€” VERIFY slug
	'login_url'       => home_url( '/login/' ),         // UWP Login â€” VERIFY slug

	// The query var GeoDirectory search expects for the category select.
	// Common patterns: 'spincl' or the taxonomy 'gd_placecategory'. VERIFY by
	// inspecting the GD Search page form on this install and matching its field name.
	'cat_query_var'   => 'spincl',
	// The location/near query var the GD search form uses. VERIFY likewise.
	'loc_query_var'   => 'snear',

	// Category archive URLs â€” fill after Task 2. Key = slug.
	'cats' => array(
		'activities-play'    => home_url( '/places/category/activities-play/' ),
		'events-programs'    => home_url( '/places/category/events-programs/' ),
		'restaurants-dining' => home_url( '/places/category/restaurants-dining/' ),
		'parks-nature'       => home_url( '/places/category/parks-nature/' ),
		'retail-shopping'    => home_url( '/places/category/retail-shopping/' ),
		'sports-fitness'     => home_url( '/places/category/sports-fitness/' ),
		'services'           => home_url( '/places/category/services/' ),
	),

	// Show the stats bar only when there are at least this many listings.
	'stats_min' => 10,
);

// Live counts (fall back to 0 if GD not detected).
$cp_total = function_exists( 'calmerplaces_total_places' ) ? calmerplaces_total_places() : 0;
$cp_count = function( $slug ) {
	return function_exists( 'calmerplaces_category_count' ) ? calmerplaces_category_count( $slug ) : 0;
};
$cp_show_stats = ( $cp_total >= $CP['stats_min'] );

get_header();
?>

<main class="cp-home">

  <!-- HERO -->
  <section class="cp-hero">
    <div class="cp-hero-mesh"></div>
    <div class="cp-hero-dots"></div>
    <div class="cp-wrap">
      <div class="cp-hero-inner">
        <div class="cp-hero-l cp-fu">
          <div class="cp-pill">
            <span class="cp-pill-dot"></span>
            <span>Portland, OR &mdash; Verified sensory directory</span>
          </div>
          <h1>Places that<br><em>actually get it.</em></h1>
          <p class="cp-hero-p">A verified directory of sensory-friendly venues for autistic kids, neurodivergent families, and anyone who needs the world turned down a little.</p>
          <div class="cp-hero-meta">
            <span>Every listing checked</span>
            <span class="cp-hm-div"></span>
            <span>Real accommodations, not claims</span>
            <span class="cp-hm-div"></span>
            <span>Free to use</span>
          </div>
        </div>
        <div class="cp-hero-r cp-fu cp-d2">
          <form class="cp-srch" method="get" action="<?php echo esc_url( $CP['search_url'] ); ?>">
            <div class="cp-srch-label">Find a place near you</div>
            <div class="cp-srch-fields">
              <select class="cp-srch-f" name="<?php echo esc_attr( $CP['cat_query_var'] ); ?>" aria-label="Category">
                <option value="">What are you looking for?</option>
                <option value="activities-play">Activities &amp; Play</option>
                <option value="events-programs">Events &amp; Programs</option>
                <option value="restaurants-dining">Restaurants &amp; Dining</option>
                <option value="parks-nature">Parks &amp; Nature</option>
                <option value="retail-shopping">Retail &amp; Shopping</option>
                <option value="sports-fitness">Sports &amp; Fitness</option>
                <option value="services">Services</option>
              </select>
              <input class="cp-srch-f" type="text" name="<?php echo esc_attr( $CP['loc_query_var'] ); ?>" placeholder="Portland, OR" aria-label="Location">
            </div>
            <button class="cp-srch-btn" type="submit">Search CalmerPlaces &rarr;</button>
            <div class="cp-quick-row">
              <span class="cp-qlabel">Quick:</span>
              <a href="<?php echo esc_url( $CP['archive_url'] ); ?>" class="cp-qt">Quiet hours</a>
              <a href="<?php echo esc_url( $CP['archive_url'] ); ?>" class="cp-qt">IBCCES certified</a>
              <a href="<?php echo esc_url( $CP['archive_url'] ); ?>" class="cp-qt">Has quiet room</a>
              <a href="<?php echo esc_url( $CP['archive_url'] ); ?>" class="cp-qt">Sensory kits</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- STATS (auto-hidden until >= stats_min listings) -->
  <div class="cp-stats<?php echo $cp_show_stats ? '' : ' cp-hide'; ?>">
    <div class="cp-wrap">
      <div class="cp-stats-row">
        <div class="cp-stat"><span class="cp-sn"><?php echo esc_html( $cp_total ); ?></span><span class="cp-sl">Verified places<br>in Portland</span></div>
        <div class="cp-stat"><span class="cp-sn">7</span><span class="cp-sl">Categories<br>covered</span></div>
        <div class="cp-stat"><span class="cp-sn"><?php echo esc_html( $cp_count( 'services' ) + 0 ); ?></span><span class="cp-sl">IBCCES certified<br>venues</span></div>
        <div class="cp-stat"><span class="cp-sn">100%</span><span class="cp-sl">Checked before<br>they&rsquo;re listed</span></div>
      </div>
    </div>
  </div>

  <!-- CATEGORIES -->
  <section class="cp-sec cp-sec-bg" id="cats">
    <div class="cp-wrap">
      <div class="cp-s-head cp-c">
        <span class="cp-s-eyebrow">Browse by type</span>
        <h2>Where does your family need to go today?</h2>
        <p>Every category filtered for genuine sensory accommodations &mdash; not marketing claims.</p>
      </div>
      <div class="cp-cat-grid">

        <a href="<?php echo esc_url( $CP['cats']['activities-play'] ); ?>" class="cp-cc">
          <div class="cp-cc-icon"><svg viewBox="0 0 24 24"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg></div>
          <h3>Activities &amp; Play</h3>
          <p>Sensory gyms, indoor playgrounds, children&rsquo;s museums with quiet programming.</p>
          <?php $c = $cp_count('activities-play'); if ($c): ?><div class="cp-cc-count"><?php echo esc_html($c); ?> places in Portland &rarr;</div><?php endif; ?>
        </a>

        <a href="<?php echo esc_url( $CP['cats']['events-programs'] ); ?>" class="cp-cc">
          <div class="cp-cc-icon"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg></div>
          <h3>Events &amp; Programs</h3>
          <p>Sensory-friendly screenings, relaxed performances, seasonal events.</p>
          <?php $c = $cp_count('events-programs'); if ($c): ?><div class="cp-cc-count"><?php echo esc_html($c); ?> places in Portland &rarr;</div><?php endif; ?>
        </a>

        <a href="<?php echo esc_url( $CP['cats']['restaurants-dining'] ); ?>" class="cp-cc">
          <div class="cp-cc-icon"><svg viewBox="0 0 24 24"><path d="M4 3v7a3 3 0 006 0V3M14 3c0 5 6 5 6 0"/></svg></div>
          <h3>Restaurants &amp; Dining</h3>
          <p>Cafes and restaurants with quiet hours, calm seating, low noise.</p>
          <?php $c = $cp_count('restaurants-dining'); if ($c): ?><div class="cp-cc-count"><?php echo esc_html($c); ?> places in Portland &rarr;</div><?php endif; ?>
        </a>

        <a href="<?php echo esc_url( $CP['cats']['parks-nature'] ); ?>" class="cp-cc">
          <div class="cp-cc-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="6"/><path d="M12 16v6M8 20h8"/></svg></div>
          <h3>Parks &amp; Nature</h3>
          <p>Accessible playgrounds, sensory gardens, and low-traffic quiet trails.</p>
          <?php $c = $cp_count('parks-nature'); if ($c): ?><div class="cp-cc-count"><?php echo esc_html($c); ?> places in Portland &rarr;</div><?php endif; ?>
        </a>

        <a href="<?php echo esc_url( $CP['cats']['retail-shopping'] ); ?>" class="cp-cc">
          <div class="cp-cc-icon"><svg viewBox="0 0 24 24"><path d="M6 2L4 6v14a2 2 0 002 2h12a2 2 0 002-2V6l-2-4zM4 6h16"/></svg></div>
          <h3>Retail &amp; Shopping</h3>
          <p>Stores with sensory hours, dimmed lighting, reduced background noise.</p>
          <?php $c = $cp_count('retail-shopping'); if ($c): ?><div class="cp-cc-count"><?php echo esc_html($c); ?> places in Portland &rarr;</div><?php endif; ?>
        </a>

        <a href="<?php echo esc_url( $CP['cats']['sports-fitness'] ); ?>" class="cp-cc">
          <div class="cp-cc-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div>
          <h3>Sports &amp; Fitness</h3>
          <p>Adaptive gymnastics, sensory swim times, inclusive leagues.</p>
          <?php $c = $cp_count('sports-fitness'); if ($c): ?><div class="cp-cc-count"><?php echo esc_html($c); ?> places in Portland &rarr;</div><?php endif; ?>
        </a>

        <a href="<?php echo esc_url( $CP['cats']['services'] ); ?>" class="cp-cc">
          <div class="cp-cc-icon"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg></div>
          <h3>Services</h3>
          <p>Sensory-aware salons, dental offices, and providers trained to help.</p>
          <?php $c = $cp_count('services'); if ($c): ?><div class="cp-cc-count"><?php echo esc_html($c); ?> places in Portland &rarr;</div><?php endif; ?>
        </a>

        <a href="<?php echo esc_url( $CP['archive_url'] ); ?>" class="cp-cc cp-dark">
          <div class="cp-cc-icon"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg></div>
          <h3>Browse all places</h3>
          <p>Search the full directory with custom filters.</p>
          <?php if ($cp_total): ?><div class="cp-cc-count"><?php echo esc_html($cp_total); ?> listings &rarr;</div><?php endif; ?>
        </a>

      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="cp-sec" id="how">
    <div class="cp-wrap">
      <div class="cp-how-grid">
        <div>
          <div class="cp-s-head">
            <span class="cp-s-eyebrow">How it works</span>
            <h2>Know before you go.</h2>
            <p>Planning an outing shouldn&rsquo;t require three phone calls and a gamble. We&rsquo;ve done that work for you.</p>
          </div>
          <div class="cp-how-steps">
            <div class="cp-hs"><div class="cp-hs-n">01</div><div class="cp-hs-c"><h3>Search your area</h3><p>Filter by category, accommodation type, or exactly what your family needs &mdash; quiet rooms, sensory hours, trained staff, IBCCES certification.</p></div></div>
            <div class="cp-hs"><div class="cp-hs-n">02</div><div class="cp-hs-c"><h3>Read the real details</h3><p>Every listing tells you exactly what&rsquo;s offered &mdash; the hours, the setup, what to expect on arrival. No vague claims, no surprises.</p></div></div>
            <div class="cp-hs"><div class="cp-hs-n">03</div><div class="cp-hs-c"><h3>Go with confidence</h3><p>Arrive knowing it&rsquo;s a place that genuinely accommodates sensory differences &mdash; so your whole family can actually relax.</p></div></div>
          </div>
        </div>
        <div class="cp-how-vis">
          <div class="cp-how-vis-bg"></div>
          <div class="cp-ml">
            <div class="cp-ml-h"><div class="cp-ml-ico"><svg viewBox="0 0 24 24"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg></div><div><div class="cp-ml-nm">We Rock the Spectrum</div><div class="cp-ml-meta">Activities &amp; Play &middot; NE Portland</div></div></div>
            <div class="cp-ml-tags"><span class="cp-mt cp-a">&#10003; IBCCES Certified</span><span class="cp-mt">Quiet Room</span><span class="cp-mt">Sensory Hours</span><span class="cp-mt cp-s">Trained Staff</span><span class="cp-mt">Sensory Kits</span></div>
          </div>
          <div class="cp-ml">
            <div class="cp-ml-h"><div class="cp-ml-ico"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/></svg></div><div><div class="cp-ml-nm">AMC Lloyd Center</div><div class="cp-ml-meta">Events &amp; Programs &middot; Lloyd District</div></div></div>
            <div class="cp-ml-tags"><span class="cp-mt">Sensory Screenings</span><span class="cp-mt cp-s">Lowered Volume</span><span class="cp-mt">Raised Lights</span></div>
          </div>
          <div class="cp-ml">
            <div class="cp-ml-h"><div class="cp-ml-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="6"/><path d="M12 16v6"/></svg></div><div><div class="cp-ml-nm">Leach Botanical Garden</div><div class="cp-ml-meta">Parks &amp; Nature &middot; SE Portland</div></div></div>
            <div class="cp-ml-tags"><span class="cp-mt">Low Noise</span><span class="cp-mt cp-s">Wheelchair Accessible</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- VERIFIED -->
  <section class="cp-sec cp-ver-sec" id="verified">
    <div class="cp-wrap">
      <div class="cp-ver-grid">
        <div class="cp-ver-text">
          <span class="cp-s-eyebrow">Our standard</span>
          <h2>Verified means we checked. Every time.</h2>
          <p>Anyone can put &ldquo;autism-friendly&rdquo; on a website. We only list places where we&rsquo;ve confirmed what they actually offer &mdash; so you&rsquo;re not finding out on arrival that it wasn&rsquo;t what you hoped.</p>
          <ul class="cp-vchecks">
            <li><div class="cp-vck"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span><strong>Real programming, confirmed.</strong> We check for specific accommodations &mdash; hours, rooms, policies &mdash; not marketing language.</span></li>
            <li><div class="cp-vck"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span><strong>IBCCES certifications flagged clearly.</strong> Where venues hold Certified Autism Center status, we surface it prominently.</span></li>
            <li><div class="cp-vck"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span><strong>Specific, not vague.</strong> &ldquo;Sensory hours every first Sunday 8&ndash;10am&rdquo; &mdash; not &ldquo;sensory accommodations available.&rdquo;</span></li>
            <li><div class="cp-vck"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span><strong>Written by people who understand.</strong> Clear language, respectful framing, no clinical jargon.</span></li>
          </ul>
        </div>
        <div>
          <div class="cp-ld-card">
            <div class="cp-ld-top">
              <div class="cp-ld-icon"><svg viewBox="0 0 24 24"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg></div>
              <div><div class="cp-ld-nm">We Rock the Spectrum</div><div class="cp-ld-sub">Activities &amp; Play &middot; NE Portland, OR</div></div>
            </div>
            <div class="cp-ld-body">
              <div class="cp-ld-sl">Verified accommodations</div>
              <div class="cp-ld-tags">
                <span class="cp-ldt cp-v">&#10003; IBCCES Certified Autism Center</span>
                <span class="cp-ldt">Quiet room on-site</span>
                <span class="cp-ldt">Sensory kits available</span>
                <span class="cp-ldt">All-abilities equipment</span>
                <span class="cp-ldt">Trained staff</span>
                <span class="cp-ldt">Visual schedules</span>
              </div>
              <div class="cp-ld-sl">What to know before you go</div>
              <div class="cp-ld-note">Sensory-friendly open play runs weekday mornings 9am&ndash;12pm with reduced capacity and lower music. The quiet room is available on request. Staff hold IBCCES training. Weekend sessions are busier &mdash; call ahead if noise sensitivity is a significant factor.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- VENUE CTA -->
  <section class="cp-sec-bg" style="padding:80px 0">
    <div class="cp-wrap">
      <div class="cp-vcta">
        <div>
          <span class="cp-s-eyebrow">For venues &amp; businesses</span>
          <h2>Run a place that welcomes sensory-sensitive guests?</h2>
          <p>If you&rsquo;ve invested in real accommodations &mdash; trained staff, quiet hours, a calm space &mdash; families need to find you. Listing your place is free, and always will be.</p>
        </div>
        <div class="cp-vcta-btns">
          <a href="<?php echo esc_url( $CP['add_listing_url'] ); ?>" class="cp-btn-teal">Add your place &rarr;</a>
          <a href="#verified" class="cp-btn-sm-o">Learn what we verify</a>
        </div>
      </div>
    </div>
  </section>

</main>

<?php
get_footer();

