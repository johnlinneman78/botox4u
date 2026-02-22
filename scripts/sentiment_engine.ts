import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.prod' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const POSITIVE_KEYWORDS = [
    'natural', 'subtle', 'conservative', 'honest', 'listen',
    'gentle', 'perfect', 'recommend', 'touch-up', 'follow-up',
    'not overdone', 'refreshed', 'youthful', 'skilled'
];

const NEGATIVE_KEYWORDS = [
    'frozen', 'droopy', 'overdone', 'heavy', 'dropped',
    'uneven', 'bruised', 'swollen', 'rushed', 'pushy',
    'oversold', 'botched', 'unnatural'
];

async function runSentimentAnalysis() {
    console.log('--- STARTING SENTIMENT ANALYSIS ENGINE (Results Quality) ---');

    // Fetch providers with reviews
    const { data: providers, error } = await supabase
        .from('providers')
        .select('id, name, top_reviews');

    if (error || !providers) {
        console.error('Error fetching providers:', error);
        return;
    }

    console.log(`Analyzing ${providers.length} providers...`);

    let updatedCount = 0;

    for (const provider of providers) {
        const reviews = provider.top_reviews as any[];
        if (!reviews || !Array.isArray(reviews)) continue;

        let positiveCount = 0;
        let negativeCount = 0;
        let totalReviewText = '';

        reviews.forEach(review => {
            if (review.text) {
                const text = review.text.toLowerCase();
                totalReviewText += ' ' + text;

                POSITIVE_KEYWORDS.forEach(word => {
                    if (text.includes(word)) positiveCount++;
                });

                NEGATIVE_KEYWORDS.forEach(word => {
                    if (text.includes(word)) negativeCount++;
                });
            }
        });

        // Calculate score: Simple ratio/count based score (0-30 pts)
        // Baseline 15 if they have reviews but no keywords.
        // +2 for each positive, -3 for each negative.
        let resultsScore = 15;
        if (totalReviewText.length > 0) {
            resultsScore = 15 + (positiveCount * 2) - (negativeCount * 5);
        } else {
            // If they have reviews but no text (just ratings), use the rating as a proxy
            // Wait, we want text-based signals. If no text, we keep baseline or slightly adjust by rating.
            // Placeholder: 15
        }

        // Clamp 0-30
        resultsScore = Math.min(30, Math.max(0, resultsScore));

        // Update DB
        const { error: updateError } = await supabase
            .from('providers')
            .update({
                score_results_quality: resultsScore,
                positive_keyword_count: positiveCount,
                negative_keyword_count: negativeCount,
                sentiment_analyzed_at: new Date().toISOString()
            })
            .eq('id', provider.id);

        if (updateError) {
            console.error(`Error updating provider ${provider.name}:`, updateError);
        } else {
            updatedCount++;
        }
    }

    console.log(`\nSentiment analysis complete. Updated ${updatedCount} providers.`);
}

runSentimentAnalysis();
