
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

async function checkProgress() {
    const { count: total, error: e1 } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true });

    const { count: enriched, error: e2 } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true })
        .not('enriched_at', 'is', null);

    const { count: successes, error: e3 } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true })
        .not('google_place_id', 'is', null);

    if (e1 || e2 || e3) {
        console.error('Error fetching progress');
        return;
    }

    console.log(`--- Enrichment Progress ---`);
    console.log(`Total Providers: ${total}`);
    console.log(`Enriched: ${enriched} (${Math.round(enriched / total * 100)}%)`);
    console.log(`Verified (Google ID): ${successes}`);
    console.log(`Ghost (No Google ID): ${enriched - successes}`);
}

checkProgress();
