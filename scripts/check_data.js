
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

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkData() {
    const { data: providers, error } = await supabase
        .from('providers')
        .select('name, rating, review_count, top_reviews, hero_image_url')
        .not('rating', 'is', null)
        .limit(5);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${providers.length} providers with ratings.`);
    providers.forEach(p => {
        const hasReviewsText = p.top_reviews && p.top_reviews.some(r => r.text !== null);
        console.log(`- ${p.name}: Rating=${p.rating}, ReviewsCount=${p.review_count}, HasReviewText=${hasReviewsText}, HeroImage=${p.hero_image_url}`);
    });
}

checkData().catch(console.error);
