
const fs = require('fs');
const path = require('path');

const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const GOOGLE_API_KEY = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

async function testNewApi() {
    const query = "Beverly Hills Rejuvenation Center Scottsdale AZ";
    const url = 'https://places.googleapis.com/v1/places:searchText';

    console.log('Testing New Google Places API...');
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_API_KEY,
            'X-Goog-FieldMask': 'places.id,places.displayName'
        },
        body: JSON.stringify({ textQuery: query })
    });

    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
}
testNewApi();
