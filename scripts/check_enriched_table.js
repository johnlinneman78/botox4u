
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkEnrichedTable() {
    // First, find Sachi's ID
    const { data: provider } = await supabase
        .from('providers')
        .select('id, name')
        .ilike('name', 'Sachi Aesthetics%')
        .single();

    if (!provider) {
        console.log('Provider not found');
        return;
    }

    console.log(`Found provider: ${provider.name} (ID: ${provider.id})`);

    // Now check provider_enriched_attrs
    const { data: enriched, error } = await supabase
        .from('provider_enriched_attrs')
        .select('*')
        .eq('provider_id', provider.id)
        .single();

    if (error) {
        console.error('Error fetching enriched attrs:', error.message);
        return;
    }

    console.log('--- Enriched Attributes from Table ---');
    console.log(JSON.stringify(enriched, null, 2));
}

checkEnrichedTable();
