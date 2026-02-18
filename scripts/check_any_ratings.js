
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envRaw = fs.readFileSync(path.join(process.cwd(), '.env.prod'), 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) env[key.trim()] = vals.join('=').trim().replace(/^"(.*)"$/, '$1');
});

async function checkRatings() {
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase.from('providers').select('name, rating, city').not('rating', 'is', null).limit(10);
    if (error) {
        console.error(error);
    } else {
        console.log('--- Providers with Ratings ---');
        console.log(data);
    }
}
checkRatings();
