
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkScottsdalePrices() {
    const { data, error } = await supabase
        .from('providers')
        .select('name, price_per_unit, enriched_attrs')
        .eq('city', 'Scottsdale');

    if (error) {
        console.error(error);
        return;
    }

    console.log(`--- Scottsdale Prices (${data.length} providers) ---`);
    data.forEach(p => {
        const botoxPrice = p.enriched_attrs?.price_per_unit_botox || p.price_per_unit;
        console.log(`${p.name}: ${botoxPrice || 'NONE'}`);
    });
}

checkScottsdalePrices();
