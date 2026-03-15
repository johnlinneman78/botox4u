import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const loadEnv = (name: string) => {
    const p = path.resolve(process.cwd(), name);
    if (fs.existsSync(p)) {
        const config = dotenv.parse(fs.readFileSync(p));
        for (const k in config) {
            if (!process.env[k]) process.env[k] = config[k];
        }
    }
};
loadEnv('.env.local');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    const { count: practitionersCount, error: err1 } = await supabase
        .from('provider_practitioners')
        .select('*', { count: 'exact', head: true });

    const { count: providersCount, error: err2 } = await supabase
        .from('provider_practitioners')
        .select('provider_id', { count: 'exact', head: true })
    // we can't do distinct easily with head, so let's just fetch all and count unique

    const { data: allPractitioners } = await supabase
        .from('provider_practitioners')
        .select('provider_id');

    const uniqueProviders = new Set(allPractitioners?.map(p => p.provider_id)).size;

    console.log(`Total Practitioners Scraped: ${practitionersCount}`);
    console.log(`Providers with Practitioners: ${uniqueProviders}`);
}

main().catch(console.error);
