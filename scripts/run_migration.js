
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
    console.log('Running email scraping fields migration...');
    const sql = `
        ALTER TABLE providers 
        ADD COLUMN IF NOT EXISTS email_primary TEXT,
        ADD COLUMN IF NOT EXISTS email_secondary TEXT[],
        ADD COLUMN IF NOT EXISTS email_confidence FLOAT DEFAULT 0,
        ADD COLUMN IF NOT EXISTS email_scrape_date TIMESTAMP,
        ADD COLUMN IF NOT EXISTS email_status VARCHAR DEFAULT 'pending';

        CREATE INDEX IF NOT EXISTS idx_providers_email_status ON providers(email_status);
        CREATE INDEX IF NOT EXISTS idx_providers_email_primary ON providers(email_primary) WHERE email_primary IS NOT NULL;
    `;

    // Note: exec_sql must be defined in your Supabase DB to run this via RPC
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        console.error('Migration failed:', error.message);
        console.log('Falling back to direct update attempt if possible...');
        // If RPC fails, we can't easily run raw SQL from the client unless configured.
    } else {
        console.log('Migration successful!');
    }
}

runMigration();
