
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

async function countPending() {
    const { count, error } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true })
        .or('enriched_at.is.null,enriched_at.lt.2025-01-01');

    if (error) console.error(error);
    else console.log(`Pending enrichment: ${count} providers.`);
}
countPending();
