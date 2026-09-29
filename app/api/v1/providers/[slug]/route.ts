import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateApiKey } from '@/lib/api-auth'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const apiKeyHeader = req.headers.get('x-api-key')

    // 1. Validate API Key
    const auth = await validateApiKey(apiKeyHeader)
    if (!auth.valid) {
        return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    // 2. Get provider by slug
    const { slug } = await params

    const { data: provider, error } = await supabase
        .from('providers')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !provider) {
        return NextResponse.json(
            { error: 'Provider not found' },
            { status: 404 }
        )
    }

    // 3. Format response with structured data
    const result = {
        provider_id: provider.id,
        name: provider.name,
        slug: provider.slug,
        city: provider.city,
        state: provider.state,
        address: provider.address,
        phone: provider.phone,
        website: provider.website,
        booking_url: provider.booking_url,
        profile_url: `https://injectorindex.com/provider/${provider.slug}`,

        // Scoring
        clarityScore: provider.score_total,
        rating: parseFloat(provider.rating || provider.average_rating || '0'),
        review_count: provider.review_count || 0,
        tier: (provider.listing_tier || 'FREE').toUpperCase(),

        // Credentials
        npi_number: provider.npi_number,
        npi_verified: provider.npi_verified || false,
        npi_license_type: provider.npi_license_type,
        npi_specialty: provider.npi_specialty,
        allergan_tier: provider.allergan_tier,
        verified: provider.verified || false,

        // Services & Specialties
        services_offered: provider.services_offered || [],
        style_tags: provider.style_tags || [],
        business_type: provider.business_type,

        // Pricing
        price_per_unit: provider.price_per_unit || provider.botox_price_per_unit,

        // Location
        geo: {
            latitude: provider.lat,
            longitude: provider.lng,
        },

        // Semantic Data
        description: provider.description || provider.bio,
        score_results_quality: provider.score_results_quality,
        positive_keyword_count: provider.positive_keyword_count || 0,
        negative_keyword_count: provider.negative_keyword_count || 0,
        warning_flag: provider.warning_flag || false,

        // Metadata
        created_at: provider.created_at,
        updated_at: provider.updated_at,
        powered_by: "VerifiedAesthetics Clarity Score™"
    }

    return NextResponse.json(result)
}
