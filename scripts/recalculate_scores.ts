import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { calculateProviderScore } from '../lib/scoring';

dotenv.config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function recalculateAllScores() {
    console.log('--- STARTING GLOBAL SCORE RECALCULATION (V2.2) ---');

    // 1. Fetch all providers and their data
    const { data: providers, error } = await supabase
        .from('providers')
        .select('*');

    if (error || !providers) {
        console.error('Error fetching providers:', error);
        return;
    }

    console.log(`Recalculating for ${providers.length} providers...`);

    let updated = 0;

    for (const provider of providers) {
        // Prepare factors for calculateProviderScore
        const factors = {
            price_per_unit: provider.price_per_unit,
            rating: provider.rating,
            review_count: provider.review_count,
            has_photo: !!provider.profile_photo_url,
            has_description: !!provider.description,
            is_verified: provider.is_verified,
            npi_verified: provider.npi_verified,
            results_quality_score: provider.score_results_quality || 0,
            website: provider.website,
            responsiveness_score: 0 // Placeholder
        };

        // Note: We don't have city average easily here without another query, 
        // but calculateProviderScore has a default. 
        // For production, we should compute city average.
        const scoreBreakdown = calculateProviderScore(factors);

        // Update DB
        const { error: updateError } = await supabase
            .from('providers')
            .update({
                score: scoreBreakdown.points,
                score_grade: scoreBreakdown.grade,
                score_breakdown: scoreBreakdown.breakdown
            })
            .eq('id', provider.id);

        if (updateError) {
            console.error(`Error updating ${provider.name}:`, updateError);
        } else {
            updated++;
        }
    }

    console.log(`\nRecalculation complete. Updated ${updated} providers.`);
}

recalculateAllScores();
