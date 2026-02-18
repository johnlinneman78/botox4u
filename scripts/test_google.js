
const fs = require('fs');
const path = require('path');

// Manual env load from .env.prod
const envRaw = fs.readFileSync(path.join(process.cwd(), '.env.prod'), 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) env[key.trim()] = vals.join('=').trim().replace(/^"(.*)"$/, '$1');
});

const GOOGLE_API_KEY = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

async function testGoogle() {
    const name = "Beverly Hills Rejuvenation Center";
    const city = "Scottsdale";
    const state = "AZ";
    const query = `${name} ${city} ${state}`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;

    console.log(`Searching for: ${query}`);
    try {
        const res = await fetch(searchUrl);
        const data = await res.json();
        console.log('Status:', data.status);
        if (data.results && data.results.length > 0) {
            console.log('Found:', data.results[0].name, 'ID:', data.results[0].place_id);
            console.log('Rating:', data.results[0].rating);
        } else {
            console.log('No results found.');
            if (data.error_message) console.log('Error:', data.error_message);
        }
    } catch (e) {
        console.error('Fetch error:', e);
    }
}
testGoogle();
