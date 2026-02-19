
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

async function testUpdate() {
    console.log('Testing update on non-existent record...');
    const { error } = await supabase
        .from('providers')
        .update({ is_active: true })
        .eq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
        console.error('Update Error:', error);
    } else {
        console.log('Update Success (even if 0 rows)');
    }
}

testUpdate().catch(console.error);
