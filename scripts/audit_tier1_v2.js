const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envRaw = fs.readFileSync('.env.prod', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^\"(.*)\"$/, '$1');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const TIER_1 = [
    { city: 'New York', state: 'NY', slug: 'new-york-ny' },
    { city: 'Los Angeles', state: 'CA', slug: 'los-angeles-ca' },
    { city: 'Miami', state: 'FL', slug: 'miami-fl' },
    { city: 'Chicago', state: 'IL', slug: 'chicago-il' },
    { city: 'Dallas', state: 'TX', slug: 'dallas-tx' },
    { city: 'Houston', state: 'TX', slug: 'houston-tx' },
    { city: 'Atlanta', state: 'GA', slug: 'atlanta-ga' },
    { city: 'Las Vegas', state: 'NV', slug: 'las-vegas-nv' },
    { city: 'San Diego', state: 'CA', slug: 'san-diego-ca' },
    { city: 'Boston', state: 'MA', slug: 'boston-ma' }
];

async function audit() {
    console.log('--- Tier 1 City Audit (V2 Standards) ---');

    for (const item of TIER_1) {
        const { data: providers, error } = await supabase
            .from('providers')
            .select('rating, review_count, hero_image_url, price_per_unit, npi_verified, description, website, score_results_quality')
            .eq('city', item.city);

        if (error) {
            console.error(`Error fetching ${item.city}:`, error);
            continue;
        }

        const total = providers.length;
        const fullyEnriched = providers.filter(p =>
            p.rating !== null &&
            p.review_count !== null &&
            p.hero_image_url !== null &&
            p.price_per_unit !== null
        ).length;

        // Manual calculation of score for audit purposes
        const scored = providers.filter(p => {
            // Simplified check: if it has basic data, it can be scored
            return p.rating !== null || p.price_per_unit !== null;
        }).length;

        const status = (fullyEnriched >= 10) ? '✅ READY' : '❌ GAPS';

        console.log(`${item.city.padEnd(15)} | Total: ${total.toString().padEnd(3)} | Fully Enriched: ${fullyEnriched.toString().padEnd(3)} | Scorable: ${scored.toString().padEnd(3)} | ${status}`);

        if (fullyEnriched < 10) {
            console.log(`  -> Needs ${10 - fullyEnriched} more enriched providers`);
        }
    }
}

audit();
