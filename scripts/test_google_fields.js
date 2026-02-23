
const fs = require('fs');

const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const GOOGLE_API_KEY = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const placeId = 'ChIJf7Bnhh4LK4cRwGvRpPPKT7A'; // Sachi Aesthetics

async function testGoogleDetails() {
    const fields = '*'; // Get all fields
    const detailsUrl = `https://places.googleapis.com/v1/places/${placeId}?fields=${fields}&key=${GOOGLE_API_KEY}`;

    const res = await fetch(detailsUrl, {
        headers: {
            'X-Goog-Api-Key': GOOGLE_API_KEY,
            'X-Goog-FieldMask': '*',
            'Referer': 'https://injectorindex.com'
        }
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2))

    testGoogleDetails();
