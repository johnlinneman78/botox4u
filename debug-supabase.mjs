
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testQuery() {
    console.log('Testing connection to:', supabaseUrl)
    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .limit(1)

    if (error) {
        console.error('Connection error:', error)
        return
    }
    console.log('Columns in providers table:', Object.keys(data[0]))
}

testQuery()
