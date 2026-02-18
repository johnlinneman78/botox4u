
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env from .env.prod
const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function fixScottsdale() {
    console.log('--- Triggering Enrichment for Scottsdale ---');
    // We'll reset enriched_at for Scottsdale so the main script picks them up
    // OR we can just run the script and it should pick un-enriched ones.

    // Let's just run the enrichment script without --dry-run
    // But limit it to Scottsdale for now by modifying main() temporarily or just running it.
    // Actually, I'll just run it. The script picks up null enriched_at.
}
