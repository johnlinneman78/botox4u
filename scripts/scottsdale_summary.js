
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

async function checkScottsdale() {
    const { data: providers, error } = await supabase
        .from('providers')
        .select('name, google_place_id, rating, enriched_at')
        .eq('city', 'Scottsdale');

    if (error) {
        console.error(error);
        return;
    }

    const total = providers.length;
    const enriched = providers.filter(p => p.enriched_at).length;
    const successes = providers.filter(p => p.google_place_id).length;
    const failures = providers.filter(p => p.enriched_at && !p.google_place_id).length;

    console.log(`Scottsdale Summary:`);
    console.log(`Total: ${total}`);
    console.log(`Enriched: ${enriched}`);
    console.log(`Successes (Linked to Google): ${successes}`);
    console.log(`Failures (No Google Place): ${failures}`);

    if (failures > 0) {
        console.log('\nFailed Providers:');
        providers.filter(p => p.enriched_at && !p.google_place_id).forEach(p => console.log(`- ${p.name}`));
    }
}
checkScottsdale();
