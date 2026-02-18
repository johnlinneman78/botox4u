
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkBatch() {
    // Get the most recently enriched 100
    const { data: providers, error } = await supabase
        .from('providers')
        .select('name, google_place_id, enriched_at')
        .not('enriched_at', 'is', null)
        .order('enriched_at', { ascending: false })
        .limit(100);

    if (error) {
        console.error(error);
        return;
    }

    const successes = providers.filter(p => p.google_place_id).length;
    const failures = providers.filter(p => !p.google_place_id).length;

    console.log(`Last Batch Results:`);
    console.log(`Successes: ${successes}`);
    console.log(`Failures (Hidden): ${failures}`);
}
checkBatch();
