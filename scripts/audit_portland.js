
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function auditPortland() {
    console.log('--- Auditing Portland Providers ---')
    const { data, error } = await supabase
        .from('providers')
        .select('id, name, slug, price_per_unit, hero_image_url, verified, city')
        .ilike('city', 'Portland%')

    if (error) {
        console.error('Error fetching providers:', error)
        return
    }

    // Filter to ensure only Portland, OR (case insensitive)
    const portland = data.filter(p => p.city.toLowerCase().includes('portland'))
    console.log(`Found ${portland.length} providers in Portland.`)

    const pendingPricing = portland.filter(p => !p.price_per_unit).length
    const repeatedImages = portland.filter(p => p.hero_image_url && p.hero_image_url.includes('photo-1629909613654-28e377c37b09')).length

    console.log(`- Missing Pricing: ${pendingPricing}`)
    console.log(`- Repeated Stock Images: ${repeatedImages}`)

    portland.forEach(p => {
        console.log(`[${p.slug}] Pricing: ${p.price_per_unit || 'PENDING'} | Image: ${p.hero_image_url ? (p.hero_image_url.includes('photo-1629909613654-28e377c37b09') ? 'STOCK' : 'YES') : 'NO'}`)
    })
}

auditPortland()
