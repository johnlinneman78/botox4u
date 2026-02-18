
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

async function checkFinal() {
    const { data, error } = await supabase
        .from('providers')
        .select('name, rating, hero_image_url, price_per_unit, city')
        .eq('city', 'Scottsdale')
        .limit(5);

    console.log('--- FINAL CHECK (Scottsdale) ---');
    if (error) {
        console.error(error);
    } else {
        console.table(data);
    }
}
checkFinal();
