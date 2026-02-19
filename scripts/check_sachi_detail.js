
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSachiDetail() {
    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .ilike('name', 'Sachi Aesthetics%')
        .single();

    if (error) {
        console.error(error);
        return;
    }

    console.log('--- DB Data for Sachi ---');
    console.log('price_per_unit:', data.price_per_unit);
    console.log('enriched_attrs:', JSON.stringify(data.enriched_attrs, null, 2));
}

checkSachiDetail();
