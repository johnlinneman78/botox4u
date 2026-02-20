const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function inspect() {
    const { data: providers, error } = await supabase
        .from('providers')
        .select('*')
        .eq('city', 'New York')
        .limit(3);

    if (error) {
        console.error(error);
        return;
    }

    console.log(JSON.stringify(providers, null, 2));
}

inspect();
