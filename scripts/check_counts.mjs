
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testQuery() {
    const cityName = "Portland"
    const stateCode = "OR"

    console.log(`Executing query for City: "${cityName}", State: "${stateCode}"`)

    let queryBuilder = supabase
        .from('providers')
        .select('*')
        .ilike('city', cityName.trim())
        .ilike('state', stateCode.trim())

    const { data, error } = await queryBuilder

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log(`Results found: ${data.length}`)
    if (data.length > 0) {
        console.log(`First item: ${data[0].name} (Status: ${data[0].display_status})`)
    }
}

testQuery()
