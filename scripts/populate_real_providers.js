/**
 * populate_real_providers.js
 * 
 * Two-step provider discovery:
 * 1. Google Places API → Find businesses advertising botox/medspa (DISCOVERY)
 * 2. NPI Registry → Verify medical credentials (VERIFICATION)
 * 
 * Google Places TOS: OK for directory use WITH attribution + map display
 * (site already has Google attribution configured in niche.js)
 * 
 * NPI Registry: 100% public federal data, no restrictions
 * 
 * Usage: node scripts/populate_real_providers.js [--city Portland] [--dry-run]
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}
if (!googleApiKey) {
    console.error('❌ Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Parse args
const args = process.argv.slice(2);
const cityFilter = args.includes('--city') ? args[args.indexOf('--city') + 1] : null;
const dryRun = args.includes('--dry-run');

// Cities from niche.js
const ALL_CITIES = [
    { name: "New York", state: "NY", lat: 40.7128, lng: -74.0060 },
    { name: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437 },
    { name: "Miami", state: "FL", lat: 25.7617, lng: -80.1918 },
    { name: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298 },
    { name: "Dallas", state: "TX", lat: 32.7767, lng: -96.7970 },
    { name: "Houston", state: "TX", lat: 29.7604, lng: -95.3698 },
    { name: "Atlanta", state: "GA", lat: 33.7490, lng: -84.3880 },
    { name: "Denver", state: "CO", lat: 39.7392, lng: -104.9903 },
    { name: "San Diego", state: "CA", lat: 32.7157, lng: -117.1611 },
    { name: "Nashville", state: "TN", lat: 36.1627, lng: -86.7816 },
    { name: "Austin", state: "TX", lat: 30.2672, lng: -97.7431 },
    { name: "Charlotte", state: "NC", lat: 35.2271, lng: -80.8431 },
    { name: "Las Vegas", state: "NV", lat: 36.1699, lng: -115.1398 },
    { name: "Tampa", state: "FL", lat: 27.9506, lng: -82.4572 },
    { name: "Portland", state: "OR", lat: 45.5152, lng: -122.6784 },
    { name: "Minneapolis", state: "MN", lat: 44.9778, lng: -93.2650 },
    { name: "Philadelphia", state: "PA", lat: 39.9526, lng: -75.1652 },
    { name: "Washington", state: "DC", lat: 38.9072, lng: -77.0369 },
    { name: "Boston", state: "MA", lat: 42.3601, lng: -71.0589 },
    { name: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321 },
    { name: "Scottsdale", state: "AZ", lat: 33.4942, lng: -111.9261 },
    { name: "Rochester", state: "NY", lat: 43.1566, lng: -77.6088 },
];

const CITIES = cityFilter
    ? ALL_CITIES.filter(c => c.name.toLowerCase() === cityFilter.toLowerCase())
    : ALL_CITIES;

// Search queries that specifically find Botox/aesthetic providers
const SEARCH_QUERIES = [
    'botox near',
    'medspa near',
    'botox injector near',
    'dermal filler near',
    'aesthetic injector near',
];

function slugify(name, city, state) {
    return `${name}-${city}-${state}`
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 100);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Google Places Text Search (New API)
async function searchGooglePlaces(query, lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=30000&key=${googleApiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
            console.error(`  Google Places error: ${data.status} - ${data.error_message || ''}`);
            return [];
        }

        return data.results || [];
    } catch (err) {
        console.error(`  Fetch error:`, err.message);
        return [];
    }
}

// Get detailed info from Google Places
async function getPlaceDetails(placeId) {
    const fields = 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,place_id,types,url,business_status';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${googleApiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.result || null;
    } catch (err) {
        console.error(`  Details error for ${placeId}:`, err.message);
        return null;
    }
}

// NPI lookup by name + state
async function lookupNPI(name, state) {
    // Try organization name first
    let url = `https://npiregistry.cms.hhs.gov/api/?version=2.1&organization_name=${encodeURIComponent(name)}&state=${state}&limit=3`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.result_count > 0 && data.results) {
            return data.results[0];
        }

        // Try splitting name for individual lookup
        const parts = name.split(' ');
        if (parts.length >= 2) {
            url = `https://npiregistry.cms.hhs.gov/api/?version=2.1&first_name=${encodeURIComponent(parts[0])}&last_name=${encodeURIComponent(parts[parts.length - 1])}&state=${state}&limit=3`;
            const response2 = await fetch(url);
            const data2 = await response2.json();

            if (data2.result_count > 0 && data2.results) {
                return data2.results[0];
            }
        }

        return null;
    } catch (err) {
        return null;
    }
}

function parseGoogleResult(place, details, city, state) {
    const name = details?.name || place.name;
    const address = details?.formatted_address || place.formatted_address || '';
    const phone = details?.formatted_phone_number || null;
    const website = details?.website || null;
    const rating = details?.rating || place.rating || null;
    const reviewCount = details?.user_ratings_total || place.user_ratings_total || 0;
    const googlePlaceId = place.place_id;
    const lat = place.geometry?.location?.lat || null;
    const lng = place.geometry?.location?.lng || null;

    return {
        name,
        slug: slugify(name, city, state),
        city,
        state,
        address: address.split(',').slice(0, 2).join(',').trim(), // just street address
        phone,
        website,
        rating,
        review_count: reviewCount,
        google_place_id: googlePlaceId,
        lat,
        lng,
        listing_tier: 'free',
        outreach_status: 'not_sent',
        verified: false,
        business_type: 'organization',
    };
}

async function populateCity(city) {
    console.log(`\n🏙️  ${city.name}, ${city.state}`);
    console.log('─'.repeat(50));

    const allPlaces = new Map(); // dedupe by google_place_id

    for (const query of SEARCH_QUERIES) {
        const fullQuery = `${query} ${city.name} ${city.state}`;
        console.log(`  🔍 Searching: "${fullQuery}"`);

        const results = await searchGooglePlaces(fullQuery, city.lat, city.lng);

        for (const place of results) {
            // Filter: only businesses that are operational
            if (place.business_status && place.business_status !== 'OPERATIONAL') continue;

            // Dedupe
            if (!allPlaces.has(place.place_id)) {
                allPlaces.set(place.place_id, place);
            }
        }

        await delay(200); // Google rate limit
    }

    console.log(`  📋 Found ${allPlaces.size} unique businesses`);

    // Get details + NPI verification for each
    const providers = [];
    let npiVerified = 0;

    for (const [placeId, place] of allPlaces) {
        // Get full details
        const details = await getPlaceDetails(placeId);
        await delay(100);

        const provider = parseGoogleResult(place, details, city.name, city.state);

        // Skip if no rating (likely not a real, active business)
        if (!provider.rating || provider.review_count < 3) {
            continue;
        }

        // Try NPI verification
        const npiResult = await lookupNPI(provider.name, city.state);
        await delay(200);

        if (npiResult) {
            provider.npi_number = npiResult.number;
            provider.npi_verified = true;
            provider.npi_lookup_attempted = true;
            provider.npi_verified_at = new Date().toISOString();

            const taxonomies = npiResult.taxonomies || [];
            provider.npi_license_type = taxonomies.find(t => t.primary)?.desc || '';
            provider.npi_specialty = taxonomies.map(t => t.desc).join(', ');
            provider.credentials = taxonomies.map(t => t.desc);
            npiVerified++;
        } else {
            provider.npi_lookup_attempted = true;
            provider.npi_verified = false;
        }

        providers.push(provider);
    }

    console.log(`  ✅ ${providers.length} valid providers (${npiVerified} NPI-verified)`);

    if (dryRun) {
        console.log(`  [DRY RUN] Would insert ${providers.length} providers`);
        providers.slice(0, 5).forEach(p => {
            console.log(`    ${p.name} | ⭐${p.rating} (${p.review_count}) | 📞${p.phone || 'N/A'} | NPI:${p.npi_verified ? '✅' : '❌'} | 🌐${p.website ? 'YES' : 'NO'}`);
        });
        return { city: city.name, state: city.state, found: providers.length, inserted: 0, npiVerified };
    }

    // Upsert to Supabase
    let inserted = 0;
    let errors = 0;

    for (const provider of providers) {
        // Check for existing by google_place_id first, then slug
        const { data: existingByGid } = await supabase
            .from('providers')
            .select('id')
            .eq('google_place_id', provider.google_place_id)
            .single();

        if (existingByGid) {
            // Update existing
            const { error } = await supabase
                .from('providers')
                .update({
                    name: provider.name,
                    phone: provider.phone,
                    website: provider.website,
                    address: provider.address,
                    rating: provider.rating,
                    review_count: provider.review_count,
                    lat: provider.lat,
                    lng: provider.lng,
                    npi_number: provider.npi_number,
                    npi_verified: provider.npi_verified,
                    npi_license_type: provider.npi_license_type,
                    npi_specialty: provider.npi_specialty,
                    npi_verified_at: provider.npi_verified_at,
                    npi_lookup_attempted: provider.npi_lookup_attempted,
                    credentials: provider.credentials,
                })
                .eq('id', existingByGid.id);

            if (!error) inserted++;
            else errors++;
        } else {
            // Insert new
            const { error } = await supabase
                .from('providers')
                .insert(provider);

            if (error) {
                if (error.code === '23505') {
                    // Duplicate slug
                    provider.slug = `${provider.slug}-${Date.now()}`;
                    const { error: retry } = await supabase.from('providers').insert(provider);
                    if (!retry) inserted++;
                    else { console.error(`    ❌ ${provider.name}: ${retry.message}`); errors++; }
                } else {
                    console.error(`    ❌ ${provider.name}: ${error.message}`);
                    errors++;
                }
            } else {
                inserted++;
            }
        }
    }

    console.log(`  💾 Upserted: ${inserted} | Errors: ${errors}`);
    return { city: city.name, state: city.state, found: providers.length, inserted, npiVerified };
}

async function main() {
    console.log('🚀 Real Provider Population');
    console.log('   Discovery: Google Places API (botox/medspa searches)');
    console.log('   Verification: NPI Registry (federal credentials)');
    if (dryRun) console.log('   ⚠️  DRY RUN MODE — no database writes');
    if (cityFilter) console.log(`   📍 Filtered to: ${cityFilter}`);
    console.log('');

    const results = [];

    for (const city of CITIES) {
        const result = await populateCity(city);
        results.push(result);
        await delay(2000); // Longer delay between cities
    }

    // Summary
    console.log('\n\n📊 FINAL SUMMARY');
    console.log('═'.repeat(60));
    let totalFound = 0, totalInserted = 0, totalNPI = 0;

    for (const r of results) {
        console.log(`  ${r.city}, ${r.state}: ${r.found} found, ${r.inserted} upserted, ${r.npiVerified} NPI-verified`);
        totalFound += r.found;
        totalInserted += r.inserted;
        totalNPI += r.npiVerified;
    }

    console.log('═'.repeat(60));
    console.log(`  TOTAL: ${totalFound} providers, ${totalInserted} upserted, ${totalNPI} NPI-verified`);
}

main().catch(console.error);
