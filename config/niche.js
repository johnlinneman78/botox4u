// config/niche.js - [DEPLOY_TRIGGER: 2026-02-23]
// THIS IS THE ONLY FILE THAT CHANGES BETWEEN WHITE LABEL DEPLOYMENTS
// Everything else in the codebase reads from this file

export const NICHE = {
    // Business identity
    name: "Botox",                          // "Botox", "IV Therapy", "Dental Implants"
    namePlural: "Aesthetic Medicine Providers",
    providerType: "provider",               // "injector", "clinic", "provider", "dentist"
    providerTypePlural: "providers",
    siteName: "VerifiedAesthetics",
    // Google has indexed the www host: 995 pages vs 5 on the bare domain.
    // Vercel must redirect injectorindex.com -> www, not the reverse.
    domain: "www.injectorindex.com",
    baseUrl: "https://www.injectorindex.com",
    contactEmail: "hello@verifiedaesthetics.com",
    tagline: "Find the Best Botox & Filler Injectors Near You — Rated by Data, Not Ads",
    brandName: "VerifiedAesthetics",
    brandSuffix: "™",
    links: {
        twitter: "verifiedaesthetics",
        facebook: "verifiedaesthetics",
        instagram: "verifiedaesthetics"
    },

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
    baseSlug: "injectors",                      // /injectors/[city] — change to /iv-therapy/ etc

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
        { name: "New York", state: "NY", slug: "ny/new-york" },
        { name: "Los Angeles", state: "CA", slug: "ca/los-angeles" },
        { name: "Miami", state: "FL", slug: "fl/miami" },
        { name: "Chicago", state: "IL", slug: "il/chicago" },
        { name: "Dallas", state: "TX", slug: "tx/dallas" },
        { name: "Houston", state: "TX", slug: "tx/houston" },
        { name: "Atlanta", state: "GA", slug: "ga/atlanta" },
        { name: "Denver", state: "CO", slug: "co/denver" },
        { name: "San Diego", state: "CA", slug: "ca/san-diego" },
        { name: "Nashville", state: "TN", slug: "tn/nashville" },
        { name: "Austin", state: "TX", slug: "tx/austin" },
        { name: "Charlotte", state: "NC", slug: "nc/charlotte" },
        { name: "Las Vegas", state: "NV", slug: "nv/las-vegas" },
        { name: "Tampa", state: "FL", slug: "fl/tampa" },
        { name: "Portland", state: "OR", slug: "or/portland" },
        { name: "Minneapolis", state: "MN", slug: "mn/minneapolis" },
        { name: "Philadelphia", state: "PA", slug: "pa/philadelphia" },
        { name: "Washington", state: "DC", slug: "dc/washington" },
        { name: "Boston", state: "MA", slug: "ma/boston" },
        { name: "Seattle", state: "WA", slug: "wa/seattle" },
        { name: "Scottsdale", state: "AZ", slug: "az/scottsdale" },
        { name: "Rochester", state: "NY", slug: "ny/rochester" }
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
    metaDescriptionTemplate: "Compare top-rated Botox & filler injectors in {city}. See Clarity Scores™, real pricing, and verified credentials. Find natural results, ranked by data.",

    // Pricing tiers (for /pricing page)
    pricingTiers: [
        {
            id: "free",
            name: "Free",
            price: 0,
            interval: "month",
            features: [
                "Basic listing in directory",
                "Appears in city search results",
                "Name, location & credential display",
                "Clarity Score™ visible"
            ],
            bestFor: "Individual providers getting started"
        },
        {
            // id stays "verified" because Stripe price mapping and stored
            // subscription_tier values use it. The display name is "Enhanced":
            // a "verified" label must come from passing checks, not payment.
            id: "verified",
            name: "Enhanced",
            price: 49,
            interval: "month",
            anchor: true,                        // highlighted tier
            features: [
                "Your photos, description and pricing on your profile",
                "Real pricing listed for patients",
                "Tracked 'Go to Website' clicks",
                "Prominent Contact button",
                "Does not change your ranking or Clarity Score™"
            ],
            bestFor: "Active med spas wanting more leads"
        },
        {
            id: "featured",
            name: "Featured",
            price: 99,
            interval: "month",
            features: [
                "Everything in Enhanced",
                "\"Featured\" highlight on your profile card",
                "Monthly profile-views and clicks report",
                "Visual only: does not change your ranking or Clarity Score™"
            ],
            bestFor: "Market leaders wanting maximum visibility"
        }
    ],

    // Outreach email sender
    outreach: {
        senderName: "John Linneman",
        senderEmail: "hello@verifiedaesthetics.com",
        senderTitle: "Founder, VerifiedAesthetics"
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
            subtext: "VerifiedAesthetics scores providers across multiple cities on credentials, technique quality, and patient outcomes. See real pricing before you book.",
            cta: "Compare Top-Rated Injectors"
        },
        trustBadges: [
            { icon: 'target', label: 'Confirmed Credentials', description: 'Injector licenses matched against the federal NPI registry' },
            { icon: 'verify', label: 'Clarity Score™', description: 'Credentials, reviews, published pricing and contact details, scored in the open' },
            { icon: 'shield', label: 'No Pay-to-Rank', description: 'Paid plans never change a ranking or a score' }
        ],
        scoreDisclaimer: "VerifiedAesthetics is an independent data research platform for aesthetic providers. We are not a medical provider. Our mission is to provide transparency in the aesthetic market by indexing provider data, pricing, and neutral patient feedback. No provider can pay for a higher Clarity Score™ position.",
        footerDisclaimer: "VerifiedAesthetics.com is an independent provider directory and research index for aesthetic medicine. We are not a clinic, we do not perform medical procedures, and we do not provide clinical advice. All data is gathered from public records to facilitate independent research of aesthetic providers."
    }
}
