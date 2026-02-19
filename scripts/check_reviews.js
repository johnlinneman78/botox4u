
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

async function checkData() {
    const { data: providers, error } = await supabase
        .from('providers')
        .select('name, top_reviews')
        .limit(1000);

    if (error) {
        console.error('Error:', error);
        return;
    }

    const providersWithReviews = providers.filter(p => p.top_reviews && p.top_reviews.some(r => r.text !== null));
    console.log(`Found ${providersWithReviews.length} providers with verbatim review text.`);
    providersWithReviews.slice(0, 5).forEach(p => {
        console.log(`- ${p.name}`);
    });
}

checkData().catch(console.error);
