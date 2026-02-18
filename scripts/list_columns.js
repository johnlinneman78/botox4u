
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manual env load from .env.prod
const envRaw = fs.readFileSync(path.join(process.cwd(), '.env.prod'), 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) env[key.trim()] = vals.join('=').trim().replace(/^"(.*)"$/, '$1');
});

async function listColumns() {
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase.from('providers').select('*').limit(1);
    if (error) {
        console.error(error);
    } else if (data && data[0]) {
        console.log('Columns:', Object.keys(data[0]).sort().join(', '));
    }
}
listColumns();
