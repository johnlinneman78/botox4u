const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setup() {
    console.log('Using URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    const { data, error } = await supabase
        .from('api_keys')
        .upsert({
            key: 'mcp-internal-999',
            owner_name: 'MCP Server Wrapper',
            tier: 'PRO',
            active: true,
            call_limit: 1000000
        }, { onConflict: 'key' })

    if (error) {
        console.error('Error creating API key:', error)
        process.exit(1)
    }
    console.log('MCP Internal API Key created/verified.')
}

setup()
