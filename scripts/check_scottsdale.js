
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manual env load from .env.prod
const envRaw = fs.readFileSync(path.join(process.cwd(), '.env.prod'), 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) env[key.trim()] = vals.join('=').trim().replace(/^"(.*)"$/, '$1');
});

async function checkScottsdale() {
    const url = env.NEXT_PUBLIC_SUPABASE_URL;
    const key = env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(url, key);

    console.log('--- Detailed Scottsdale Data ---');
    const { data: providers, error } = await supabase
        .from('providers')
        .select('*')
        .eq('city', 'Scottsdale')
        .limit(3);

    if (error) {
        console.error('Error:', error);
        return;
    }

    providers.forEach(p => {
        console.log(`Provider: ${p.name}`);
        console.log(` - rating: ${p.rating}`);
        console.log(` - review_count: ${p.review_count}`);
        console.log(` - hero_image_url: ${p.hero_image_url}`);
        console.log(` - enriched_at: ${p.enriched_at}`);
        console.log(` - google_place_id: ${p.google_place_id}`);
        console.log('-------------------');
    });
}
checkScottsdale();
