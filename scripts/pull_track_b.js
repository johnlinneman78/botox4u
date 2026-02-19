require('dotenv').config({ path: '.env.prod' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TOP_20_METROS = [
    'Scottsdale', 'Austin', 'Baltimore', 'Charleston', 'Dallas',
    'Fresno', 'Houston', 'Kansas City', 'Las Vegas', 'Louisville',
    'Memphis', 'Milwaukee', 'Nashville', 'New Orleans', 'Oklahoma City',
    'Omaha', 'Raleigh', 'Richmond', 'Sacramento', 'Salt Lake City'
];

async function pullTrackB() {
    console.log('🚀 Pulling Track B Outreach List...');

    const { data: providers, error } = await supabase
        .from('providers')
        .select('id, name, city, state, rating, review_count, website, listing_tier, slug')
        .in('city', TOP_20_METROS)
        .gte('rating', 4.7)
        .gte('review_count', 75)
        .order('review_count', { ascending: false });

    if (error) {
        console.error('Error fetching providers:', error);
        return;
    }

    console.log(`✅ Found ${providers.length} Track B candidates.`);

    const outreachList = providers.map(p => ({
        ...p,
        outreach_status: 'pending',
        priority: 'Track B'
    }));

    fs.writeFileSync('docs/TRACK_B_OUTREACH.json', JSON.stringify(outreachList, null, 2));

    console.log('\n--- PREVIEW (TOP 10) ---');
    outreachList.slice(0, 10).forEach(p => {
        console.log(`- ${p.name} (${p.city}, ${p.state}) | ⭐ ${p.rating} | 📝 ${p.review_count} | 🔗 ${p.website || 'No website'}`);
    });

    console.log('\nFull list saved to docs/TRACK_B_OUTREACH.json');
}

pullTrackB();
