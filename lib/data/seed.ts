import { createClient } from '@supabase/supabase-js'
import { mockProviders } from './mock-providers'

/**
 * SEEDING SCRIPT
 * 
 * Usage: 
 * 1. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local
 * 2. Run: npx tsx --env-file=.env.local lib/data/seed.ts
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
    console.log('🚀 Starting seeding process...')

    for (const provider of mockProviders) {
        console.log(`Inserting provider: ${provider.name}...`)

        const { error } = await supabase
            .from('providers')
            .upsert({
                name: provider.name,
                slug: provider.slug,
                business_type: provider.business_type,
                address: provider.address,
                city: provider.city,
                state: provider.state,
                phone: provider.phone,
                website: provider.website,
                average_rating: provider.average_rating,
                review_count: provider.review_count,
                listing_tier: provider.listing_tier,
                verified: provider.verified,
                price_per_unit: provider.price_per_unit,
                min_treatment_price: provider.min_treatment_price,
                description: provider.description,
                services_offered: provider.services_offered,
                credentials: provider.credentials,
            }, { onConflict: 'slug' })

        if (error) {
            console.error(`❌ Error inserting ${provider.name}:`, error.message)
        } else {
            console.log(`✅ ${provider.name} inserted successfully.`)
        }
    }

    console.log('✨ Seeding complete!')
}

seed().catch((err) => {
    console.error('Fatal error during seeding:', err)
    process.exit(1)
})
