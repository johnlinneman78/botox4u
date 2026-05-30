<?php
/**
 * CalmerPlaces Child Theme functions
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * Enqueue parent (Astra) and child styles, plus Google Fonts.
 */
function calmerplaces_enqueue_styles() {
	// Astra parent stylesheet
	wp_enqueue_style(
		'astra-parent-style',
		get_template_directory_uri() . '/style.css',
		array(),
		wp_get_theme( 'astra' )->get( 'Version' )
	);

	// Child stylesheet (the CalmerPlaces design system)
	wp_enqueue_style(
		'calmerplaces-child-style',
		get_stylesheet_uri(),
		array( 'astra-parent-style' ),
		wp_get_theme()->get( 'Version' )
	);

	// Google Fonts: Instrument Serif + DM Sans
	wp_enqueue_style(
		'calmerplaces-fonts',
		'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap',
		array(),
		null
	);
}
add_action( 'wp_enqueue_scripts', 'calmerplaces_enqueue_styles' );

/**
 * Preconnect to Google Fonts for performance.
 */
function calmerplaces_resource_hints( $urls, $relation_type ) {
	if ( 'preconnect' === $relation_type ) {
		$urls[] = 'https://fonts.gstatic.com';
	}
	return $urls;
}
add_filter( 'wp_resource_hints', 'calmerplaces_resource_hints', 10, 2 );

/**
 * Helper: return live count of published GD places in a category slug.
 * Used by front-page.php to show real counts (or hide them at zero).
 *
 * NOTE: GeoDirectory's post type is typically 'gd_place' and the
 * category taxonomy is 'gd_placecategory'. Verify on this install.
 */
function calmerplaces_category_count( $slug ) {
	$term = get_term_by( 'slug', $slug, 'gd_placecategory' );
	if ( $term && ! is_wp_error( $term ) ) {
		return (int) $term->count;
	}
	return 0;
}

/**
 * Helper: total published places across the directory.
 */
function calmerplaces_total_places() {
	$counts = wp_count_posts( 'gd_place' );
	return isset( $counts->publish ) ? (int) $counts->publish : 0;
}

/**
 * Helper: count of published GD places that are IBCCES certified.
 */
function calmerplaces_ibcces_count() {
	$args = array(
		'post_type'      => 'gd_place',
		'post_status'    => 'publish',
		'meta_query'     => array(
			array(
				'key'     => 'ibcces_certified',
				'value'   => '1',
				'compare' => '=',
			),
		),
		'fields'         => 'ids',
		'posts_per_page' => -1,
	);
	$posts = get_posts( $args );
	return is_array( $posts ) ? count( $posts ) : 0;
}

/**
 * Render and return the verified accommodations and 'What to know before you go' section.
 */
function calmerplaces_details_html() {
	$id = get_the_ID();
	if ( ! $id || get_post_type( $id ) !== 'gd_place' ) {
		return '';
	}

	$fields = array(
		'ibcces_certified'     => array( 'label' => 'IBCCES Certified', 'class' => 'cp-mt cp-a', 'prefix' => '✓ ' ),
		'has_quiet_room'       => array( 'label' => 'Quiet Room', 'class' => 'cp-mt' ),
		'sensory_hours'        => array( 'label' => 'Sensory Hours', 'class' => 'cp-mt' ),
		'trained_staff'        => array( 'label' => 'Trained Staff', 'class' => 'cp-mt cp-s' ),
		'has_sensory_kits'     => array( 'label' => 'Sensory Kits', 'class' => 'cp-mt' ),
		'dimmed_lighting'      => array( 'label' => 'Dimmed Lighting', 'class' => 'cp-mt' ),
		'low_noise'            => array( 'label' => 'Low Noise', 'class' => 'cp-mt' ),
		'wheelchair_accessible' => array( 'label' => 'Wheelchair Accessible', 'class' => 'cp-mt cp-s' ),
	);

	$tags_html = '';
	foreach ( $fields as $key => $data ) {
		$val = get_post_meta( $id, $key, true );
		if ( $val && $val !== '0' ) {
			$prefix = isset( $data['prefix'] ) ? $data['prefix'] : '';
			$tags_html .= sprintf(
				'<span class="%s">%s%s</span>',
				esc_attr( $data['class'] ),
				$prefix,
				esc_html( $data['label'] )
			);
		}
	}

	$before_you_go = get_post_meta( $id, 'before_you_go', true );
	$street = get_post_meta( $id, 'street', true );
	$city = get_post_meta( $id, 'city', true );
	$region = get_post_meta( $id, 'region', true );
	$zip = get_post_meta( $id, 'zip', true );
	
	$address_parts = array_filter( array( $street, $city, $region, $zip ) );
	$full_address = implode( ', ', $address_parts );
	
	$phone = get_post_meta( $id, 'phone', true );
	$website = get_post_meta( $id, 'website', true );
	
	$html = '<div class="cp-details-meta" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #d8e8ea;">';
	if ( ! empty( $tags_html ) ) {
		$html .= '<div class="cp-ld-sl" style="font-size: 11px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #5a7a80; margin-bottom: 10px;">VERIFIED ACCOMMODATIONS</div>';
		$html .= '<div class="cp-ml-tags" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px;">' . $tags_html . '</div>';
	}
	
	if ( ! empty( $full_address ) || ! empty( $phone ) || ! empty( $website ) ) {
		$html .= '<div class="cp-ld-sl" style="font-size: 11px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #5a7a80; margin-bottom: 10px;">CONTACT & LOCATION</div>';
		$html .= '<div class="cp-contact-info" style="font-size: 14px; color: #2d4a4f; line-height: 1.6; background: #fafdfd; border: 1px solid #d8e8ea; border-radius: 8px; padding: 16px; margin-bottom: 24px;">';
		if ( ! empty( $full_address ) ) {
			$html .= '<div style="margin-bottom: 8px;"><strong>Address:</strong> ' . esc_html( $full_address ) . '</div>';
		}
		if ( ! empty( $phone ) ) {
			$html .= '<div style="margin-bottom: 8px;"><strong>Phone:</strong> ' . esc_html( $phone ) . '</div>';
		}
		if ( ! empty( $website ) ) {
			$html .= '<div><strong>Website:</strong> <a href="' . esc_url( $website ) . '" target="_blank" style="color: #1a6b77; font-weight: 600; text-decoration: none;">' . esc_html( $website ) . ' &rarr;</a></div>';
		}
		$html .= '</div>';
	}
	
	if ( ! empty( $before_you_go ) ) {
		$html .= '<div class="cp-ld-sl" style="font-size: 11px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #5a7a80; margin-bottom: 10px;">WHAT TO KNOW BEFORE YOU GO</div>';
		$html .= '<div class="cp-ld-note" style="font-size: 14px; color: #2d4a4f; line-height: 1.6; background: #f5f9fa; border: 1px solid #d8e8ea; border-radius: 8px; padding: 16px;">' . wp_kses_post( wpautop( $before_you_go ) ) . '</div>';
	}
	$html .= '</div>';
	
	return $html;
}

/**
 * Automatically append the details section to the listing content on single pages.
 */
function calmerplaces_append_details_to_content( $content ) {
	if ( is_singular( 'gd_place' ) && in_the_loop() && is_main_query() ) {
		$details = calmerplaces_details_html();
		return $content . $details;
	}
	return $content;
}
add_filter( 'the_content', 'calmerplaces_append_details_to_content' );


/**
 * Warmer and category-specific dynamic "No listings found" empty state message.
 */
function calmerplaces_no_listings_found_message( $message, $post_type ) {
	if ( $post_type === 'gd_place' ) {
		$term = get_queried_object();
		if ( $term && isset( $term->taxonomy ) && $term->taxonomy === 'gd_placecategory' ) {
			$cat_name = $term->name;
			$slug = $term->slug;
			$singular = 'venue';
			switch ( $slug ) {
				case 'activities-play':
					$singular = 'indoor playground or play space';
					break;
				case 'events-programs':
					$singular = 'sensory event or program';
					break;
				case 'restaurants-dining':
					$singular = 'restaurant or cafe';
					break;
				case 'parks-nature':
					$singular = 'park or outdoor space';
					break;
				case 'retail-shopping':
					$singular = 'store or shop';
					break;
				case 'sports-fitness':
					$singular = 'sports or fitness program';
					break;
				case 'services':
					$singular = 'service provider';
					break;
			}
			return sprintf(
				__( "We're actively verifying %s listings for Portland. Know a sensory-friendly %s? Help us build this category — <a href='%s'>suggest a place</a>.", 'calmerplaces-child' ),
				esc_html( $cat_name ),
				$singular,
				esc_url( home_url( '/add-listing/' ) )
			);
		}
		return sprintf(
			__( "We're actively verifying listings for Portland. Know a sensory-friendly place? Help us build our directory — <a href='%s'>suggest a place</a>.", 'calmerplaces-child' ),
			esc_url( home_url( '/add-listing/' ) )
		);
	}
	return $message;
}
add_filter( 'geodir_no_listings_found_message', 'calmerplaces_no_listings_found_message', 10, 2 );

/**
 * Add a short line of copy above the review/comment form.
 */
function calmerplaces_comment_form_before() {
	if ( is_singular( 'gd_place' ) ) {
		echo '<p class="cp-review-intro" style="font-size: 14px; color: #5a7a80; margin-bottom: 12px; font-weight: 500;">' . esc_html__( 'Been here? Help other families by sharing what the experience was actually like.', 'calmerplaces-child' ) . '</p>';
	}
}
add_action( 'comment_form_before', 'calmerplaces_comment_form_before' );

/**
 * SEO: Override H1 on GeoDirectory category archive pages.
 * Pattern: "Sensory-Friendly {Category Name} in Portland, OR"
 * This ensures each category page has a keyword-rich H1 for search engines.
 */
function calmerplaces_category_archive_h1( $title ) {
	if ( is_tax( 'gd_placecategory' ) ) {
		$term = get_queried_object();
		if ( $term && ! is_wp_error( $term ) ) {
			return 'Sensory-Friendly ' . esc_html( $term->name ) . ' in Portland, OR';
		}
	}
	return $title;
}
add_filter( 'get_the_archive_title', 'calmerplaces_category_archive_h1', 999 );

/**
 * SEO: Prepend category description to the page content on GeoDirectory archive pages.
 */
function calmerplaces_prepend_category_description( $content ) {
	if ( is_tax( 'gd_placecategory' ) && is_main_query() && ! in_the_loop() ) {
		$desc = get_the_archive_description();
		if ( $desc ) {
			$desc_html = '<div class="taxonomy-description ast-archive-description" style="margin-bottom: 24px; font-size: 16px; color: #5a7a80; line-height: 1.6; background: #fafdfd; border: 1px solid #d8e8ea; border-radius: 8px; padding: 16px;">' . wp_kses_post( $desc ) . '</div>';
			return $desc_html . $content;
		}
	}
	return $content;
}
add_filter( 'the_content', 'calmerplaces_prepend_category_description' );

/**
 * SEO: Inject amenityFeature schema markup on listing pages.
 * Outputs a supplemental JSON-LD block declaring sensory-friendly
 * accommodation features. This is the key competitive differentiator —
 * no competitor (BeLikeBuddy, PDX Parent, Travel Oregon) has this.
 *
 * Only fires on single gd_place pages. Reads the checked custom fields
 * and builds LocationFeatureSpecification entries for each.
 */
function calmerplaces_amenity_feature_schema() {
	if ( ! is_singular( 'gd_place' ) ) {
		return;
	}

	$id = get_the_ID();
	if ( ! $id ) {
		return;
	}

	// Map custom field keys to human-readable feature names
	$feature_map = array(
		'ibcces_certified'      => 'IBCCES Certified Autism Center',
		'has_sensory_kits'      => 'Sensory Kits Available',
		'has_quiet_room'        => 'Quiet Room',
		'sensory_hours'         => 'Sensory-Friendly Hours',
		'dimmed_lighting'       => 'Dimmed Lighting',
		'low_noise'             => 'Low Noise Environment',
		'trained_staff'         => 'Trained Staff',
		'wheelchair_accessible' => 'Wheelchair Accessible',
	);

	$features = array();

	// Always include the base "Sensory-Friendly" feature
	$features[] = array(
		'@type' => 'LocationFeatureSpecification',
		'name'  => 'Sensory-Friendly',
		'value' => true,
	);

	// Add specific features based on checked fields
	foreach ( $feature_map as $key => $label ) {
		$val = get_post_meta( $id, $key, true );
		if ( $val && $val !== '0' ) {
			$features[] = array(
				'@type' => 'LocationFeatureSpecification',
				'name'  => $label,
				'value' => true,
			);
		}
	}

	// Build the schema block
	$schema = array(
		'@context'       => 'https://schema.org',
		'@type'          => 'LocalBusiness',
		'name'           => get_the_title( $id ),
		'amenityFeature' => $features,
	);

	// Add address if available
	$street = get_post_meta( $id, 'street', true );
	$city   = get_post_meta( $id, 'city', true );
	$region = get_post_meta( $id, 'region', true );
	$zip    = get_post_meta( $id, 'zip', true );

	if ( $street || $city ) {
		$schema['address'] = array(
			'@type'           => 'PostalAddress',
			'streetAddress'   => $street ?: '',
			'addressLocality' => $city ?: 'Portland',
			'addressRegion'   => $region ?: 'OR',
			'postalCode'      => $zip ?: '',
			'addressCountry'  => 'US',
		);
	}

	// Add URL and phone if available
	$phone   = get_post_meta( $id, 'phone', true );
	$website = get_post_meta( $id, 'website', true );
	if ( $phone ) {
		$schema['telephone'] = $phone;
	}
	if ( $website ) {
		$schema['url'] = $website;
	}

	// Output as JSON-LD
	echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
}
add_action( 'wp_head', 'calmerplaces_amenity_feature_schema' );

/**
 * Fix hidden tab Leaflet map height/width initialization bug.
 */
add_action( 'wp_footer', function() {
	if ( is_singular( 'gd_place' ) ) {
		?>
		<script type="text/javascript">
		jQuery(document).ready(function($) {
			// Trigger invalidateSize and center alignment when the map tab is activated
			$('a[href="#post_map"], button[data-bs-target="#post_map"], #post_map-tab').on('click shown.bs.tab', function() {
				setTimeout(function() {
					if (typeof jQuery.goMap !== 'undefined' && typeof jQuery.goMap.map !== 'undefined') {
						jQuery.goMap.map.invalidateSize();
						var center = jQuery.goMap.map.getCenter();
						if (center) {
							jQuery.goMap.map.panTo(center);
						}
					}
				}, 250);
			});
		});
		</script>
		<?php
	}
}, 100 );
