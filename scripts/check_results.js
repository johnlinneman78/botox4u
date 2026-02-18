
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkRecent() {
    console.log('--- Checking Scottsdale and Recent Enrichments ---');
    const { data: providers, error } = await supabase
        .from('providers')
        .select('name, city, google_place_id, rating, enriched_at')
        .eq('city', 'Scottsdale')
        .limit(20);

    if (error) {
        console.error(error);
        return;
    }

    console.table(providers);
}
checkRecent();
