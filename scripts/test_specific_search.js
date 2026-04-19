
const fs = require('fs');
const path = require('path');

const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const GOOGLE_API_KEY = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

async function testSearch(name, city, state) {
    const query = `${name} ${city} ${state}`;
    console.log(`Searching for: ${query}`);

    const url = 'https://places.googleapis.com/v1/places:searchText';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_API_KEY,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
            'Referer': 'https://www.verifiedaesthetics.com'
        },
        body: JSON.stringify({ textQuery: query })
    });

    const data = await res.json();
    console.log('Results:', JSON.stringify(data, null, 2));
}

testSearch("Beverly Hills Rejuvenation Center", "Scottsdale", "AZ");
