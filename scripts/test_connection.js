
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function listTables() {
    // There isn't a direct "list tables" in PostgREST unless RPC/Postgres functions exist
    // But we can try to select from common ones or use the internal postgres schema if permitted

    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error connecting to providers:', error.message);
    } else {
        console.log('Connected to providers table successfully');
        console.log('Columns in providers:', Object.keys(data[0]));
    }
}

listTables();
