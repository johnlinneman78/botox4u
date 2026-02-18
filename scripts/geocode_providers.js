require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

console.log('Environment Check:');
console.log('- Supabase URL:', supaUrl ? '✅ Loaded' : '❌ Missing');
console.log('- Service Role Key:', supaKey ? '✅ Loaded' : '❌ Missing');
console.log('- Maps API Key:', GOOGLE_MAPS_API_KEY ? '✅ Loaded' : '❌ Missing');

if (!supaUrl || !supaKey || !GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'PLACEHOLDER_KEY') {
    console.error('CRITICAL: Missing or placeholder environment variables. Edit .env.local first.');
    process.exit(1);
}

const supabase = createClient(supaUrl, supaKey);

async function geocodeAddress(address) {
    if (!address) return null;
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: GOOGLE_MAPS_API_KEY
            }
        });

        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng,
                formatted_address: response.data.results[0].formatted_address
            };
        } else {
            console.warn(`Geocoding failed for "${address}": ${response.data.status}`);
            if (response.data.error_message) console.warn(`Error message: ${response.data.error_message}`);
            return null;
        }
    } catch (error) {
        console.error(`Error geocoding "${address}":`, error.response ? error.response.data : error.message);
        return null;
    }
}

async function updateProviderLocations() {
    console.log('\n--- Starting geocoding process ---');

    // Fetch providers without coordinates
    const { data: providers, error } = await supabase
        .from('providers')
        .select('id, name, address, city, state')
        .or('lat.is.null,lng.is.null');

    if (error) {
        console.error('Error fetching providers from Supabase:', JSON.stringify(error, null, 2));
        return;
    }

    if (!providers || providers.length === 0) {
        console.log('No providers found that require geocoding.');
        return;
    }

    console.log(`Found ${providers.length} providers to geocode.`);

    for (const provider of providers) {
        // Construct a full address string for better accuracy
        let fullAddress = provider.address;
        if (!fullAddress) {
            fullAddress = `${provider.city}, ${provider.state}`;
        } else {
            fullAddress = `${provider.address}, ${provider.city}, ${provider.state}`;
        }

        console.log(`Processing: ${provider.name} (${fullAddress})`);

        const location = await geocodeAddress(fullAddress);

        if (location) {
            const { error: updateError } = await supabase
                .from('providers')
                .update({
                    lat: location.lat,
                    lng: location.lng
                })
                .eq('id', provider.id);

            if (updateError) {
                console.error(`❌ Failed to update ${provider.name}:`, updateError.message);
            } else {
                console.log(`✅ Updated ${provider.name}: ${location.lat}, ${location.lng}`);
            }
        }

        // Respect API rate limits (mild pause)
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n--- Geocoding complete ---');
}

updateProviderLocations().catch(err => {
    console.error('Fatal error in script:', err);
});
