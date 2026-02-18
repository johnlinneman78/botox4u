
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manual env load if dotenv fails
const envRaw = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) env[key.trim()] = vals.join('=').trim().replace(/^"(.*)"$/, '$1');
});

async function checkSchema() {
    const url = env.NEXT_PUBLIC_SUPABASE_URL;
    const key = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('Missing URL or KEY', { url: !!url, key: !!key });
        return;
    }

    const supabase = createClient(url, key);
    const { data, error } = await supabase.from('providers').select('*').limit(1).single();
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Columns:', Object.keys(data).sort().join(', '));
        console.log('Enriched Data Keys:', Object.keys(data).filter(k => k.includes('enriched') || k.includes('google') || k.includes('rating') || k.includes('review') || k.includes('badges') || k.includes('gallery') || k.includes('description') || k.includes('image')));
        console.log('Sample Values:', {
            google_place_id: data.google_place_id,
            rating: data.rating,
            review_count: data.review_count,
            top_reviews: data.top_reviews ? 'Found' : 'Missing',
            top_reviews_first: data.top_reviews?.[0]?.author_name,
            hero_image_url: data.hero_image_url,
            image_url: data.image_url
        });
    }
}
checkSchema();
