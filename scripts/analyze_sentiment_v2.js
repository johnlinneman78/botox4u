
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const loadEnv = (name) => {
    const p = path.resolve(process.cwd(), name);
    if (fs.existsSync(p)) {
        const config = dotenv.parse(fs.readFileSync(p));
        for (const k in config) {
            process.env[k] = config[k];
        }
    }
};

// Prioritize .env.local for local dev, then .env.prod
if (fs.existsSync('.env.local')) {
    loadEnv('.env.local');
} else {
    loadEnv('.env.prod');
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing Supabase credentials. Ensure .env.local or .env.prod exists.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Scoring V2 Constants
const POSITIVE_KEYWORDS = [
    'natural', 'subtle', 'conservative', 'not overdone',
    'listened', 'careful', 'artist', 'soft',
    'minimalist', 'not frozen', 'conservative', 'honest'
];

const NEGATIVE_KEYWORDS = [
    'frozen', 'overdone', 'droopy', 'heavy',
    'didn\'t listen', 'pushy', 'fake', 'stiff',
    'upsell', 'rushed', 'bruised'
];

async function analyzeSentiment() {
    console.log('🚀 Starting Sentiment Analysis V2...');

    const { data: providers, error } = await supabase
        .from('providers')
        .select('id, name, top_reviews');

    if (error) {
        console.error('Error fetching providers:', error);
        return;
    }

    console.log(`🔍 Analyzing ${providers.length} providers...`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const provider of providers) {
        let positiveCount = 0;
        let negativeCount = 0;

        if (provider.top_reviews && Array.isArray(provider.top_reviews)) {
            const allText = provider.top_reviews
                .map(r => (r.text || '').toLowerCase())
                .join(' ');

            POSITIVE_KEYWORDS.forEach(word => {
                if (allText.includes(word)) positiveCount++;
            });

            NEGATIVE_KEYWORDS.forEach(word => {
                if (allText.includes(word)) negativeCount++;
            });
        }

        // Formula: Baseline(10) + (Pos * 5) - (Neg * 10)
        // Values clamped between 0 and 30
        let score = 10 + (positiveCount * 5) - (negativeCount * 10);
        score = Math.min(30, Math.max(0, score));

        // If no reviews, keep baseline
        if (!provider.top_reviews || provider.top_reviews.length === 0) {
            score = 10;
        }

        console.log(`[${provider.name}] - Pos: ${positiveCount}, Neg: ${negativeCount}, Score: ${score}`);

        const { error: updateError } = await supabase
            .from('providers')
            .update({
                positive_keyword_count: positiveCount,
                negative_keyword_count: negativeCount,
                score_results_quality: score,
                sentiment_analyzed_at: new Date().toISOString()
            })
            .eq('id', provider.id);

        if (updateError) {
            // console.error(`Error updating ${provider.name}:`, updateError.message);
            errorCount++;
        } else {
            updatedCount++;
        }
    }

    console.log('\n--- Sentiment Analysis Summary ---');
    console.log(`✅ Successfully updated: ${updatedCount}`);
    console.log(`❌ Failed (check schema): ${errorCount}`);

    if (errorCount > 0) {
        console.log('\n💡 Tip: It looks like the new columns haven\'t been applied to your database yet.');
        console.log('Run the migrations in supabase/migrations/20260219_add_scoring_v2_columns.sql first.');
    }
}

analyzeSentiment().catch(console.error);
