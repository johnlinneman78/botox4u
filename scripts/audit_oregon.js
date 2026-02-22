
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function auditOregon() {
    console.log('--- Auditing Oregon Providers ---')
    const { data, error } = await supabase
        .from('providers')
        .select('id, name, slug, price_per_unit, hero_image_url, verified, city, state')
        .ilike('state', 'OR')

    if (error) {
        console.error('Error fetching providers:', error)
        return
    }

    console.log(`Found ${data.length} providers in Oregon.`)

    data.forEach(p => {
        console.log(`[${p.city}] ${p.name} (${p.slug}) Pricing: ${p.price_per_unit || 'PENDING'}`)
    })
}

auditOregon()
