
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

async function cleanupGhosts() {
    console.log('--- CLEANUP: Erasing Providers without Google Presence ---');

    // Safety check: Count them first
    const { data: ghosts, error: fetchError } = await supabase
        .from('providers')
        .select('id, name')
        .not('enriched_at', 'is', null)
        .is('google_place_id', null);

    if (fetchError) {
        console.error('Fetch Error:', fetchError);
        return;
    }

    if (!ghosts || ghosts.length === 0) {
        console.log('No ghost providers found to delete.');
        return;
    }

    console.log(`Deleting ${ghosts.length} providers...`);

    const { error: deleteError } = await supabase
        .from('providers')
        .delete()
        .in('id', ghosts.map(g => g.id));

    if (deleteError) {
        console.error('Delete Error:', deleteError);
    } else {
        console.log('Successfully erased all providers without Google Places data.');
    }
}

cleanupGhosts();
