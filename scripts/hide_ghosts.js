
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const loadEnv = (name) => {
    const p = path.resolve(process.cwd(), name);
    if (fs.existsSync(p)) {
        const config = dotenv.parse(fs.readFileSync(p));
        for (const k in config) {
            process.env[k] = config[k];
        }
    }
};
loadEnv('.env.prod');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function hideGhosts() {
    console.log('Hiding ghost providers (null names, no website, or no rating)...');

    let errors = [];

    // 1. Hide null names or empty names
    const { error: e1_null } = await supabase
        .from('providers')
        .update({ is_active: false })
        .is('name', null);
    if (e1_null) errors.push(e1_null);

    const { error: e1_empty } = await supabase
        .from('providers')
        .update({ is_active: false })
        .eq('name', '');
    if (e1_empty) errors.push(e1_empty);

    // 2. Hide missing website
    const { error: e2_null } = await supabase
        .from('providers')
        .update({ is_active: false })
        .is('website', null);
    if (e2_null) errors.push(e2_null);

    const { error: e2_empty } = await supabase
        .from('providers')
        .update({ is_active: false })
        .eq('website', '');
    if (e2_empty) errors.push(e2_empty);

    // 3. Hide no ratings
    const { error: e3_null } = await supabase
        .from('providers')
        .update({ is_active: false })
        .is('rating', null);
    if (e3_null) errors.push(e3_null);

    if (errors.length > 0) {
        console.error('Errors details:');
        errors.forEach((e, i) => console.error(`Error ${i}:`, JSON.stringify(e, null, 2)));
    } else {
        console.log('Success: Ghosts hidden.');
    }
}

hideGhosts().catch(console.error);
