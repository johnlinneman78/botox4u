
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

async function resetScottsdale() {
    console.log('Resetting Scottsdale providers for re-enrichment...');
    const { error } = await supabase
        .from('providers')
        .update({ enriched_at: null, rating: null, google_place_id: null })
        .eq('city', 'Scottsdale');

    if (error) console.error(error);
    else console.log('Successfully reset Scottsdale.');
}
resetScottsdale();
