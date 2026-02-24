
import { submitLead } from './lib/actions/leads'
import { createClient } from './lib/supabase/client'

async function test() {
    console.log('Testing submitLead with empty clinic...')
    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('full_name', '')
    formData.append('treatment_type', 'Botox')
    formData.append('current_considerations', '')
    formData.append('is_first_timer', 'true')
    formData.append('client_concerns', JSON.stringify(['Safety']))
    formData.append('newsletter_opt_in', 'true')

    try {
        const result = await submitLead(formData)
        console.log('Result:', result)
    } catch (e) {
        console.error('Caught Exception:', e)
    }
}

test()
