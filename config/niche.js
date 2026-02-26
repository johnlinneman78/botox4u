// config/niche.js - [DEPLOY_TRIGGER: 2026-02-23]
// THIS IS THE ONLY FILE THAT CHANGES BETWEEN WHITE LABEL DEPLOYMENTS
// Everything else in the codebase reads from this file

export const NICHE = {
    // Business identity
    name: "Botox",                          // "Botox", "IV Therapy", "Dental Implants"
    namePlural: "Aesthetic Medicine Providers",
    providerType: "provider",               // "injector", "clinic", "provider", "dentist"
    providerTypePlural: "providers",
    siteName: "InjectorIndex — Find & Compare the Best Botox Injectors Near You",
    domain: "injectorindex.com",
    tagline: "Find the Best Botox & Filler Injectors Near You — Rated by Data, Not Ads",
    brandName: "InjectorIndex",
    brandSuffix: "™",

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
        "Botox & Dysport",
        "Lip Filler",
        "Cheek & Jaw Filler",
        "Polynucleotides (Regen)",
        "Daxxify",
        "Collagen Builders (Sculptra)",
        "Masseter / Jaw Slimming",
        "Gummy Smile",
        "Natural Results Audit"
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
    metaTitleTemplate: "Best Botox in {city} — {year} Provider Rankings & Pricing",
    metaDescriptionTemplate: "Compare top-rated Botox & filler injectors in {city}. See TrueScores, real pricing, and verified credentials. Find natural results, ranked by data.",

    // Pricing tiers (for /pricing page)
    pricingTiers: [
        {
            name: "Free",
            price: 0,
            interval: "month",
            features: [
                "Basic listing in directory",
                "Appears in city search results",
                "Name, location & credential display",
                "TrueScore™ visible"
            ],
            bestFor: "Individual providers getting started"
        },
        {
            name: "Verified",
            price: 49,
            interval: "month",
            anchor: true,                        // highlighted tier
            features: [
                "Verified Badge on profile",
                "Real pricing listed for patients",
                "Tracked 'Go to Website' clicks",
                "Prominent Contact button",
                "Basic analytics (Views & Clicks)"
            ],
            bestFor: "Active med spas wanting more leads"
        },
        {
            name: "Featured",
            price: 99,
            interval: "month",
            features: [
                "Everything in Verified",
                "Top placement in city search results",
                "Featured Provider highlight",
                "Priority in Injector Match Quiz",
                "Full analytics dashboard"
            ],
            bestFor: "Market leaders wanting maximum visibility"
        }
    ],

    // Outreach email sender
    outreach: {
        senderName: "John Linneman",
        senderEmail: "hello@injectorindex.com",
        senderTitle: "Founder, Injector Index"
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
            headline: "Find the Best Injectors Near You — Ranked by Results, Not Reviews",
            subtext: "InjectorIndex scores 500+ providers across 22 cities on credentials, technique quality, and patient outcomes. See real pricing before you book.",
            cta: "Compare Top-Rated Injectors"
        },
        trustBadges: [
            { icon: 'target', label: 'Injection Quality', description: 'AI-analyzed outcomes for natural facial harmony' },
            { icon: 'verify', label: 'TrueScore™', description: 'Proprietary rating of credentials, technique, and innovation' },
            { icon: 'shield', label: 'No Pay-to-Rank', description: ' rankings are 100% data-driven and independent' }
        ],
        scoreDisclaimer: "The Injector Index is an independent data research platform for aesthetic providers. We are not a medical provider. Our mission is to provide transparency in the aesthetic market by indexing provider data, pricing, and neutral patient feedback. No provider can pay for a higher TrueScore position.",
        footerDisclaimer: "InjectorIndex.com is an independent provider directory and research index for aesthetic medicine. We are not a clinic, we do not perform medical procedures, and we do not provide clinical advice. All data is gathered from public records to facilitate independent research of aesthetic providers."
    }
}
