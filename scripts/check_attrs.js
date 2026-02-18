
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envRaw = fs.readFileSync(path.join(process.cwd(), '.env.prod'), 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) env[key.trim()] = vals.join('=').trim().replace(/^"(.*)"$/, '$1');
});

async function checkAttrs() {
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: p, error } = await supabase.from('providers').select('name, enriched_attrs').eq('city', 'Scottsdale').limit(1).single();
    if (error) {
        console.error(error);
    } else {
        console.log('--- Attrs for ' + p.name + ' ---');
        console.log(JSON.stringify(p.enriched_attrs, null, 2));
    }
}
checkAttrs();
