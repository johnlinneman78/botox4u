/**
 * score_and_cleanup.js
 * 
 * 1. Scores all real providers (those with google_place_id) using Clarity Score™
 * 2. Removes old seed data (providers WITHOUT google_place_id AND without real data)
 * 
 * Usage: 
 *   node scripts/score_and_cleanup.js           # Score + cleanup
 *   node scripts/score_and_cleanup.js --dry-run  # Preview only
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const dryRun = process.argv.includes('--dry-run');

// --------------- SCORING (mirrors lib/scoring.ts) ---------------

function getGrade(score) {
    if (score === 0) return 'Pending';
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 60) return 'C';
    return 'Pending';
}

function calculateScore(provider) {
    // 1. Injection Quality (40 pts) — based on rating + review volume
    let injectionQuality = 0;
    if (provider.rating) {
        if (provider.rating >= 4.8) injectionQuality = 35;
        else if (provider.rating >= 4.5) injectionQuality = 28;
        else if (provider.rating >= 4.2) injectionQuality = 22;
        else if (provider.rating >= 4.0) injectionQuality = 18;
        else if (provider.rating >= 3.5) injectionQuality = 12;
        else injectionQuality = 5;
    }
    // Bonus for high review volume (social proof)
    if (provider.review_count >= 500) injectionQuality = Math.min(40, injectionQuality + 5);
    else if (provider.review_count >= 200) injectionQuality = Math.min(40, injectionQuality + 3);
    else if (provider.review_count >= 50) injectionQuality = Math.min(40, injectionQuality + 1);

    // 2. Provider Credentials (25 pts)
    let credentials = 10; // baseline for being listed
    if (provider.npi_verified) credentials = 20;
    if (provider.website) credentials = Math.min(25, credentials + 3);
    if (provider.phone) credentials = Math.min(25, credentials + 2);
    credentials = Math.min(25, credentials);

    // 3. Innovation Adoption (20 pts) — baseline for now
    let innovation = 5; // baseline
    // These will be filled in when providers claim profiles

    // 4. Treatment Range (15 pts)
    let treatmentRange = 5; // baseline for listing
    if (provider.website) treatmentRange += 3;
    if (provider.phone) treatmentRange += 2;
    treatmentRange = Math.min(15, treatmentRange);

    const total = Math.min(100, injectionQuality + credentials + innovation + treatmentRange);

    return {
        score: total,
        grade: getGrade(total),
        breakdown: {
            injectionQuality,
            credentials,
            innovation,
            treatmentRange
        }
    };
}

// --------------- MAIN ---------------

async function main() {
    console.log('🏗️  Score & Cleanup Script');
    if (dryRun) console.log('⚠️  DRY RUN — no database changes\n');

    // =========== STEP 1: Score real providers ===========
    console.log('═══ STEP 1: Scoring Real Providers ═══\n');

    const { data: realProviders, error: fetchErr } = await supabase
        .from('providers')
        .select('id, name, city, state, rating, review_count, website, phone, npi_verified, google_place_id')
        .not('google_place_id', 'is', null);

    if (fetchErr) {
        console.error('Error fetching:', fetchErr);
        return;
    }

    console.log(`Found ${realProviders.length} real providers to score\n`);

    let scored = 0;
    for (const p of realProviders) {
        const result = calculateScore(p);

        if (!dryRun) {
            await supabase.from('providers').update({
                score: result.score,
                score_grade: result.grade,
                score_breakdown: result.breakdown,
                score_total: result.score,
            }).eq('id', p.id);
        }

        scored++;
    }

    // Show distribution
    const scoreDist = { 'A+ (95-100)': 0, 'A (90-94)': 0, 'A- (85-89)': 0, 'B+ (80-84)': 0, 'B (75-79)': 0, 'B- (70-74)': 0, 'C (60-69)': 0, 'Below C': 0 };
    for (const p of realProviders) {
        const s = calculateScore(p).score;
        if (s >= 95) scoreDist['A+ (95-100)']++;
        else if (s >= 90) scoreDist['A (90-94)']++;
        else if (s >= 85) scoreDist['A- (85-89)']++;
        else if (s >= 80) scoreDist['B+ (80-84)']++;
        else if (s >= 75) scoreDist['B (75-79)']++;
        else if (s >= 70) scoreDist['B- (70-74)']++;
        else if (s >= 60) scoreDist['C (60-69)']++;
        else scoreDist['Below C']++;
    }

    console.log(`✅ Scored ${scored} providers\n`);
    console.log('Score Distribution:');
    for (const [grade, count] of Object.entries(scoreDist)) {
        const bar = '█'.repeat(Math.max(1, Math.round(count / 5)));
        console.log(`  ${grade.padEnd(15)} ${bar} ${count}`);
    }

    // =========== STEP 2: Identify seed data ===========
    console.log('\n═══ STEP 2: Cleaning Up Seed Data ═══\n');

    // Seed data = providers WITHOUT google_place_id AND without real contact info
    const { data: seedProviders, error: seedErr } = await supabase
        .from('providers')
        .select('id, name, city, state, google_place_id, website, phone')
        .is('google_place_id', null)
        .is('website', null)
        .is('phone', null);

    if (seedErr) {
        console.error('Error fetching seed data:', seedErr);
        return;
    }

    console.log(`Found ${seedProviders.length} seed/placeholder providers to remove`);

    // Show sample
    if (seedProviders.length > 0) {
        console.log('\nSample seed data being removed:');
        seedProviders.slice(0, 10).forEach(p => {
            console.log(`  🗑️  ${p.name} (${p.city}, ${p.state})`);
        });
        if (seedProviders.length > 10) {
            console.log(`  ... and ${seedProviders.length - 10} more`);
        }
    }

    if (!dryRun && seedProviders.length > 0) {
        const ids = seedProviders.map(p => p.id);

        // Delete in batches of 100
        for (let i = 0; i < ids.length; i += 100) {
            const batch = ids.slice(i, i + 100);
            const { error: delErr } = await supabase
                .from('providers')
                .delete()
                .in('id', batch);

            if (delErr) {
                console.error(`  Error deleting batch starting at ${i}:`, delErr);
            }
        }

        console.log(`\n🗑️  Deleted ${seedProviders.length} seed providers`);
    } else if (dryRun) {
        console.log(`\n[DRY RUN] Would delete ${seedProviders.length} seed providers`);
    }

    // =========== STEP 3: Final count ===========
    console.log('\n═══ FINAL DATABASE STATE ═══\n');

    const { count: totalCount } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true });

    const { count: realCount } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true })
        .not('google_place_id', 'is', null);

    const { count: withWebsite } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true })
        .not('website', 'is', null);

    const { count: withPhone } = await supabase
        .from('providers')
        .select('*', { count: 'exact', head: true })
        .not('phone', 'is', null);

    console.log(`  Total providers: ${totalCount}`);
    console.log(`  With Google Place ID: ${realCount}`);
    console.log(`  With website: ${withWebsite}`);
    console.log(`  With phone: ${withPhone}`);
    console.log('\n✅ Done!');
}

main().catch(console.error);
