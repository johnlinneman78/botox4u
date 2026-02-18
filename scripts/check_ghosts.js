
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

async function checkDeletions() {
    console.log('--- Identifying "Ghost" Providers ---');
    // Providers who have been checked (enriched_at set) but found no Google ID
    const { data: ghosts, error } = await supabase
        .from('providers')
        .select('id, name, city, state')
        .not('enriched_at', 'is', null)
        .is('google_place_id', null);

    if (error) {
        console.error(error);
        return;
    }

    console.log(`Found ${ghosts.length} providers with NO Google entry after enrichment.`);

    if (ghosts.length > 0) {
        console.log('Sample ghosts (to be erased):');
        ghosts.slice(0, 10).forEach(g => console.log(`- ${g.name} (${g.city})`));

        // Count how many are still waiting in the queue
        const { count: pending } = await supabase
            .from('providers')
            .select('*', { count: 'exact', head: true })
            .is('enriched_at', null);

        console.log(`\nNote: There are still ${pending} providers waiting to be checked.`);
    }
}
checkDeletions();
