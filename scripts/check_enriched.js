const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function inspect() {
    const { data: providers, error } = await supabase
        .from('providers')
        .select('name, rating, review_count, hero_image_url, price_per_unit, enriched_at')
        .eq('city', 'New York')
        .not('enriched_at', 'is', null)
        .limit(10);

    if (error) {
        console.error(error);
        return;
    }

    console.log('Enriched Providers in NYC:');
    providers.forEach(p => {
        console.log(`- ${p.name.padEnd(40)} | Rating: ${p.rating} | Reviews: ${p.review_count} | Hero: ${p.hero_image_url ? 'YES' : 'NO'} | Price: ${p.price_per_unit || 'N/A'}`);
    });
}

inspect();
