
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Using service role for audit

if (!supabaseKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is missing.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function auditPortland() {
    console.log('--- Auditing Portland Providers ---')
    const { data, error } = await supabase
        .from('providers')
        .select('id, name, slug, price_per_unit, imageUrl, verified')
        .ilike('city', 'Portland')

    if (error) {
        console.error('Error fetching providers:', error)
        return
    }

    console.log(`Found ${data.length} providers in Portland.`)

    const pendingPricing = data.filter(p => !p.price_per_unit).length
    const repeatedImages = data.filter(p => p.imageUrl && p.imageUrl.includes('photo-1629909613654-28e377c37b09')).length

    console.log(`- Missing Pricing: ${pendingPricing}`)
    console.log(`- Repeated Stock Images: ${repeatedImages}`)

    data.forEach(p => {
        console.log(`[${p.slug}] Pricing: ${p.price_per_unit || 'PENDING'} | Image: ${p.imageUrl ? 'YES' : 'NO'}`)
    })
}

auditPortland()
