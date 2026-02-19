
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const loadEnv = (name: string) => {
    const p = path.resolve(process.cwd(), name);
    if (fs.existsSync(p)) {
        const config = require('dotenv').parse(fs.readFileSync(p));
        for (const k in config) {
            if (!process.env[k]) process.env[k] = config[k];
        }
    }
};
loadEnv('.env.local');
loadEnv('.env');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkSchema() {
    // We can't easily query information_schema from the JS client if it's restricted,
    // but we can try to select one row and see the keys.
    const { data, error } = await supabase.from('providers').select('*').limit(1);
    if (error) {
        console.error('Error fetching sample provider:', error);
        return;
    }
    if (data && data.length > 0) {
        console.log('Columns in "providers" table:');
        console.log(Object.keys(data[0]).join(', '));
    } else {
        console.log('No providers found in table.');
    }
}

checkSchema().catch(console.error);
