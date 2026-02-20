// config/niche.js
// THIS IS THE ONLY FILE THAT CHANGES BETWEEN WHITE LABEL DEPLOYMENTS
// Everything else in the codebase reads from this file

export const NICHE = {
    // Business identity
    name: "Botox",                          // "Botox", "IV Therapy", "Dental Implants"
    namePlural: "Botox Treatments",
    providerType: "injector",               // "injector", "clinic", "provider", "dentist"
    providerTypePlural: "injectors",
    siteName: "Botox-4U.com",
    domain: "botox-4u.com",
    tagline: "Find injectors known for natural results — and see their real prices before you book.",
    brandName: "Botox",
    brandSuffix: "-4u",

    // Calculator Configuration
    calculator: {
        variables: [
            { id: 'botox', label: 'Botox' },
            { id: 'dysport', label: 'Dysport' },
            { id: 'xeomin', label: 'Xeomin' }
        ],
        treatmentAreas: [
            { id: 'forehead', label: 'Forehead Lines', defaultUnits: 20, minUnits: 10, maxUnits: 30, description: 'Smoothing horizontal lines across the forehead.' },
            { id: 'crows', label: "Crow's Feet", defaultUnits: 24, minUnits: 12, maxUnits: 36, description: 'Smoothing lines around the outer corners of eyes.' },
            { id: 'glabella', label: 'Frown Lines (11s)', defaultUnits: 20, minUnits: 15, maxUnits: 30, description: 'The "11" lines between the eyebrows.' },
            { id: 'masseter', label: 'Masseter (Jaw)', defaultUnits: 50, minUnits: 40, maxUnits: 60, description: 'Jaw slimming and TMJ pain relief.' },
            { id: 'lipflip', label: 'Lip Flip', defaultUnits: 6, minUnits: 4, maxUnits: 8, description: 'Subtle eversion of the upper lip.' },
            { id: 'bunny', label: 'Bunny Lines', defaultUnits: 6, minUnits: 4, maxUnits: 10, description: 'Lines on the sides of the nose when smiling.' }
        ]
    },

    // Pricing display
    priceUnit: "per unit",                  // "per unit", "per session", "per treatment"
    priceCurrency: "$",
    priceRange: { min: 10, max: 25 },      // typical price range for this niche

    // URL structure
    baseSlug: "botox",                      // /botox/[city] — change to /iv-therapy/ etc

    // Treatments in this niche
    treatments: [
        "Forehead Lines",
        "Crow's Feet",
        "Frown Lines",
        "Masseter / Jaw Slimming",
        "Lip Flip",
        "Brow Lift",
        "Neck Bands",
        "Hyperhidrosis",
        "Gummy Smile",
        "Bunny Lines"
    ],

    // Cities to target (top 20 metros)
    cities: [
        { name: "New York", state: "NY", slug: "new-york-ny" },
        { name: "Los Angeles", state: "CA", slug: "los-angeles-ca" },
        { name: "Miami", state: "FL", slug: "miami-fl" },
        { name: "Chicago", state: "IL", slug: "chicago-il" },
        { name: "Dallas", state: "TX", slug: "dallas-tx" },
        { name: "Houston", state: "TX", slug: "houston-tx" },
        { name: "Atlanta", state: "GA", slug: "atlanta-ga" },
        { name: "Denver", state: "CO", slug: "denver-co" },
        { name: "San Diego", state: "CA", slug: "san-diego-ca" },
        { name: "Nashville", state: "TN", slug: "nashville-tn" },
        { name: "Austin", state: "TX", slug: "austin-tx" },
        { name: "Charlotte", state: "NC", slug: "charlotte-nc" },
        { name: "Las Vegas", state: "NV", slug: "las-vegas-nv" },
        { name: "Tampa", state: "FL", slug: "tampa-fl" },
        { name: "Portland", state: "OR", slug: "portland-or" },
        { name: "Minneapolis", state: "MN", slug: "minneapolis-mn" },
        { name: "Philadelphia", state: "PA", slug: "philadelphia-pa" },
        { name: "Washington", state: "DC", slug: "washington-dc" },
        { name: "Boston", state: "MA", slug: "boston-ma" },
        { name: "Seattle", state: "WA", slug: "seattle-wa" },
        { name: "Scottsdale", state: "AZ", slug: "scottsdale-az" },
        { name: "Rochester", state: "NY", slug: "rochester-ny" }
    ],

    // Lead Form Configuration
    leadForm: {
        budgetRanges: [
            { label: "Under $300", value: "under-300" },
            { label: "$300 - $500", value: "300-500" },
            { label: "$500 - $1,000", value: "500-1000" },
            { label: "$1,000+", value: "1000+" }
        ]
    },

    // SEO
    metaTitleTemplate: "{treatment} in {city} — Compare Prices & Top Providers (2026)",
    metaDescriptionTemplate: "40% of Botox complaints are about over-injection. We score {city} providers on natural results, fair pricing, and verified credentials — so you find someone who won't overdo it.",

    // Pricing tiers (for /pricing page)
    pricingTiers: [
        {
            name: "Starter",
            price: 99,
            interval: "month",
            features: [
                "NPI Check + Verified Badge",
                "Priority placement in city search results",
                "Display your price per unit",
                "Link to your booking page"
            ],
            bestFor: "Clinics just starting with digital marketing"
        },
        {
            name: "Featured",
            price: 149,
            interval: "month",
            anchor: true,                        // highlighted tier
            features: [
                "Everything in Starter",
                "Hero photo displayed prominently",
                "Featured card placement (top 3 in your city)",
                "Featured Provider badge",
                "Monthly performance report"
            ],
            bestFor: "Established clinics wanting more new patient visibility"
        },
        {
            name: "Premium",
            price: 299,
            interval: "month",
            features: [
                "Everything in Featured",
                "Dedicated landing page with full bio and gallery",
                "Priority placement across ALL treatment pages in your city",
                "Lead notification emails",
                "Competitor pricing comparison"
            ],
            bestFor: "High-volume injectors and multi-location clinics"
        }
    ],

    // Outreach email sender
    outreach: {
        senderName: "John Linneman",
        senderEmail: "hello@botox-4u.com",
        senderTitle: "Founder, Botox-4U.com"
    },

    googleAttribution: {
        showLogo: true,
        ratingText: "Rating from Google",
        reviewText: "Review from Google",
        logoUrl: "https://developers.google.com/maps/documentation/places/web-service/policies#attribution"
    },

    // Brand V2 Copy
    copy: {
        hero: {
            headline: "The Independent Price-Verified Directory for Botox",
            subtext: "We are the Zillow for your skin. We don't offer treatments—we provide the data you need to find the right injector. Search every clinic in your city, compare verified prices, and check federal credentials before you book a single unit.",
            cta: "Search the Local Directory"
        },
        trustBadges: [
            { icon: 'target', label: 'Independent Index', description: 'We don\'t offer Botox; we index the providers who do' },
            { icon: 'dollar', label: 'Price Transparency', description: 'See real local price-per-unit before you book' },
            { icon: 'shield', label: 'Credential Search', description: 'NPI-verified license and credential data' }
        ],
        scoreDisclaimer: "The Botox-4U Index is an independent data research platform. We are not a medical provider. Our mission is to provide transparency in the cosmetic injectable market by indexing provider data, pricing, and neutral patient feedback. No provider can pay for a higher index position.",
        footerDisclaimer: "Botox-4U.com is an independent provider directory and data index. We are not a clinic, we do not perform medical procedures, and we do not provide clinical advice. All data is gathered from public records to facilitate independent research. Always verify credentials with state boards."
    }
}
