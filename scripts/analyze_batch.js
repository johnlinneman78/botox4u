
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

async function checkFailures() {
    console.log('--- Checking Recent Enrichment Results ---');
    const { data: providers, error } = await supabase
        .from('providers')
        .select('name, city, state, google_place_id, enriched_at, rating')
        .order('enriched_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error(error);
        return;
    }

    const success = providers.filter(p => p.google_place_id).length;
    const failed = providers.filter(p => !p.google_place_id && p.enriched_at).length;

    console.log(`Summary: ${success} Success, ${failed} No Place Found`);

    if (failed > 0) {
        console.log('\n--- Sample Failures ---');
        providers.filter(p => !p.google_place_id && p.enriched_at).slice(0, 10).forEach(p => {
            console.log(`[FAIL] ${p.name} (${p.city}, ${p.state})`);
        });
    }
}
checkFailures();
