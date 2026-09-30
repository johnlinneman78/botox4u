/**
 * Recompute the stored Clarity Score (score_total, score_grade,
 * score_breakdown) for every provider, using lib/scoring.ts. Pages compute
 * the score live; the stored copy is used by the public API and sorting.
 *
 * Run: npx tsx scripts/recalculate_scores.ts
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { scoreProvider } from '../lib/scoring'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const PAGE = 500

async function main() {
    let from = 0, updated = 0, failed = 0, noData = 0
    for (;;) {
        // Paginate: Supabase returns at most 1,000 rows per request
        const { data, error } = await supabase
            .from('providers')
            .select('*, practitioners:provider_practitioners(credentials:credential_suffix, taxonomy:npi_taxonomy_description, is_npi_verified:npi_verified, npi_enumeration_date)')
            .order('id')
            .range(from, from + PAGE - 1)
        if (error) throw new Error(error.message)
        if (!data || data.length === 0) break

        for (const p of data) {
            const s = scoreProvider(p)
            if (s.points === null) noData++
            const { error: e } = await supabase
                .from('providers')
                .update({ score_total: s.points, score_grade: s.grade, score_breakdown: s.breakdown })
                .eq('id', p.id)
            if (e) { failed++; console.error(`${p.slug}: ${e.message}`) } else updated++
        }
        from += PAGE
    }
    console.log(`Updated ${updated}, failed ${failed}, not enough data ${noData}`)
}

main().catch(err => { console.error(err); process.exit(1) })
