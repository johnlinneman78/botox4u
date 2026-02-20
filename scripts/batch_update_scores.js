const { createClient } = require('@supabase/supabase-js');
const { calculateProviderScore } = require('../lib/scoring.ts');
const { NICHE } = require('../config/niche.js');
require('dotenv').config({ path: '.env.local' });

// Setup Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function batchUpdateScores() {
    console.log('--- Starting Batch Score Update ---');

    // Fetch all providers
    const { data: providers, error } = await supabase
        .from('providers')
        .select('*');

    if (error) {
        console.error('Error fetching providers:', error);
        return;
    }

    console.log(`Processing ${providers.length} providers...`);

    let updatedCount = 0;

    for (const p of providers) {
        const scoreBreakdown = calculateProviderScore({
            price_per_unit: p.price_per_unit || p.botox_price_per_unit || p.enriched_attrs?.price_per_unit_botox,
            rating: parseFloat(p.rating || p.average_rating || 0),
            review_count: p.review_count || 0,
            has_photo: !!(p.hero_image_url || p.image_url),
            has_description: !!p.description,
            is_verified: p.verified || false,
            npi_verified: p.npi_verified || false,
            allergan_tier: p.allergan_tier,
            results_quality_score: p.score_results_quality,
            website: p.website,
            responsiveness_score: p.responsiveness_score
        });

        const { error: updateError } = await supabase
            .from('providers')
            .update({
                score: scoreBreakdown.points,
                score_grade: scoreBreakdown.grade,
                score_breakdown: scoreBreakdown.breakdown
            })
            .eq('id', p.id);

        if (updateError) {
            console.error(`Error updating provider ${p.name}:`, updateError);
        } else {
            updatedCount++;
            if (updatedCount % 50 === 0) {
                console.log(`Updated ${updatedCount}/${providers.length} providers...`);
            }
        }
    }

    console.log(`--- Finished! Updated ${updatedCount} providers ---`);
}

batchUpdateScores();
