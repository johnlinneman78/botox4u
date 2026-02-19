import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''

// We use service role to update provider data bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface NPIMatch {
    number: string
    credential: string
    taxonomy: string
    firstName?: string
    lastName?: string
    organizationName?: string
}

/**
 * Searches the NPI Registry for a provider match.
 */
export async function lookupNPI(name: string, state: string, isOrganization = false): Promise<NPIMatch | null> {
    try {
        const params = new URLSearchParams({
            version: '2.1',
            state: state,
            limit: '5'
        })

        if (isOrganization) {
            params.append('organization_name', name)
        } else {
            // Assume name is "First Last"
            const parts = name.split(' ')
            if (parts.length >= 2) {
                params.append('first_name', parts[0])
                params.append('last_name', parts[parts.length - 1])
            } else {
                params.append('last_name', name)
            }
        }

        const response = await fetch(`https://npiregistry.cms.hhs.gov/api/?${params.toString()}`)
        const data = await response.json()

        if (!data.results || data.results.length === 0) {
            return null
        }

        const result = data.results[0]

        // Find primary taxonomy
        const primaryTaxonomy = result.taxonomies.find((t: any) => t.primary) || result.taxonomies[0]

        return {
            number: result.number,
            credential: result.basic.credential || (isOrganization ? 'Organization' : 'Unknown'),
            taxonomy: primaryTaxonomy.desc,
            firstName: result.basic.first_name,
            lastName: result.basic.last_name,
            organizationName: result.basic.organization_name
        }
    } catch (error) {
        console.error('NPI Lookup failed:', error)
        return null
    }
}

/**
 * Verifies a provider and updates the database.
 */
export async function verifyProviderNPI(provider: { id: string, name: string, state: string }) {
    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('NPI Verification: Missing Supabase credentials')
        return null
    }

    // 1. Try as organization (often clinics are listed this way)
    let match = await lookupNPI(provider.name, provider.state, true)

    // 2. If no organization match, try as individual
    if (!match) {
        match = await lookupNPI(provider.name, provider.state, false)
    }

    if (!match) {
        await supabase
            .from('providers')
            .update({
                npi_lookup_attempted: true,
                npi_verified: false,
                npi_verified_at: new Date().toISOString()
            })
            .eq('id', provider.id)
        return null
    }

    // 3. Match found - update provider record
    const { error } = await supabase
        .from('providers')
        .update({
            npi_number: match.number,
            npi_verified: true,
            npi_license_type: match.credential,
            npi_specialty: match.taxonomy,
            npi_verified_at: new Date().toISOString(),
            npi_lookup_attempted: true
        })
        .eq('id', provider.id)

    if (error) {
        console.error(`Failed to update provider ${provider.id} with NPI data:`, error)
        return null
    }

    return match
}
