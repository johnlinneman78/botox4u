import { Metadata } from 'next'
import Link from 'next/link'
import { Code, Shield, Zap, Globe, ArrowRight, Lock, Database, Search, MapPin, Terminal } from 'lucide-react'
import { NICHE } from '@/config/niche'

export const metadata: Metadata = {
    title: 'API Documentation | InjectorIndex',
    description: 'RESTful API for structured medical aesthetics provider data. Access Clarity Score™ rankings, semantic review analysis, pricing, and provider credentials across 22 US cities.',
    alternates: {
        canonical: 'https://www.injectorindex.com/docs',
    },
}

const endpoints = [
    {
        method: 'GET',
        path: '/api/v1/providers',
        description: 'Search for medical aesthetics providers by city, specialty, score, and tier.',
        params: [
            { name: 'city', type: 'string', required: true, description: 'City name (e.g., "portland", "miami")' },
            { name: 'style', type: 'string', required: false, description: 'Aesthetic style tag (e.g., "natural", "conservative")' },
            { name: 'max_price', type: 'number', required: false, description: 'Maximum price per unit in USD' },
            { name: 'min_Clarity Score™', type: 'number', required: false, description: 'Minimum Clarity Score™ (0-100)' },
            { name: 'tier', type: 'string', required: false, description: 'Listing tier: FEATURED, VERIFIED, or FREE' },
            { name: 'limit', type: 'number', required: false, description: 'Max results (default: 10, max: 50)' },
        ],
        exampleRequest: 'curl -H "x-api-key: YOUR_KEY" \\\n  "https://www.injectorindex.com/api/v1/providers?city=portland&min_Clarity Score™=70&limit=5"',
        exampleResponse: `{
  "results": [
    {
      "provider_id": "abc123",
      "name": "Pearl District Aesthetics",
      "city": "Portland",
      "Clarity Score™": 87,
      "tier": "VERIFIED",
      "style_tags": ["natural", "conservative"],
      "avg_price": 14,
      "booking_url": "https://example.com/book",
      "profile_url": "https://injectorindex.com/provider/pearl-district-aesthetics"
    }
  ],
  "total": 23,
  "city": "portland",
  "powered_by": "InjectorIndex Clarity Score™"
}`,
    },
    {
        method: 'GET',
        path: '/api/v1/providers/:slug',
        description: 'Get a detailed provider profile including Clarity Score™ breakdown, credentials, semantic review data, and services.',
        params: [
            { name: 'slug', type: 'string', required: true, description: 'Provider URL slug (path parameter)' },
        ],
        exampleRequest: 'curl -H "x-api-key: YOUR_KEY" \\\n  "https://www.injectorindex.com/api/v1/providers/pearl-district-aesthetics"',
        exampleResponse: `{
  "provider_id": "abc123",
  "name": "Pearl District Aesthetics",
  "slug": "pearl-district-aesthetics",
  "city": "Portland",
  "state": "OR",
  "address": "123 NW 10th Ave, Portland, OR 97209",
  "phone": "(503) 555-0100",
  "website": "https://example.com",
  "profile_url": "https://www.injectorindex.com/provider/pearl-district-aesthetics",
  "Clarity Score™": 87,
  "rating": 4.8,
  "review_count": 142,
  "tier": "VERIFIED",
  "npi_number": "1234567890",
  "npi_verified": true,
  "npi_license_type": "Physician",
  "npi_specialty": "Dermatology",
  "allergan_tier": "Diamond",
  "services_offered": ["Botox", "Dysport", "Juvederm", "Sculptra"],
  "style_tags": ["natural", "conservative"],
  "price_per_unit": 14,
  "geo": { "latitude": 45.5231, "longitude": -122.6765 },
  "score_results_quality": 28,
  "positive_keyword_count": 47,
  "negative_keyword_count": 3,
  "powered_by": "InjectorIndex Clarity Score™"
}`,
    },
    {
        method: 'GET',
        path: '/api/v1/cities',
        description: 'List all cities covered by InjectorIndex with provider counts and average pricing data.',
        params: [],
        exampleRequest: 'curl -H "x-api-key: YOUR_KEY" \\\n  "https://www.injectorindex.com/api/v1/cities"',
        exampleResponse: `{
  "cities": [
    {
      "city": "Portland",
      "state": "OR",
      "provider_count": 90,
      "avg_price_per_unit": 14,
      "url": "https://www.injectorindex.com/injectors/or/portland"
    },
    {
      "city": "Miami",
      "state": "FL",
      "provider_count": 95,
      "avg_price_per_unit": 16,
      "url": "https://www.injectorindex.com/injectors/fl/miami"
    }
  ],
  "total_cities": 22,
  "total_providers": 500,
  "powered_by": "InjectorIndex Clarity Score™"
}`,
    },
    {
        method: 'GET',
        path: '/api/v1/search',
        description: 'Semantic search across all provider profiles. Returns providers matching natural language queries.',
        params: [
            { name: 'q', type: 'string', required: true, description: 'Search query (e.g., "natural looking botox portland")' },
            { name: 'limit', type: 'number', required: false, description: 'Max results (default: 10, max: 50)' },
        ],
        exampleRequest: 'curl -H "x-api-key: YOUR_KEY" \\\n  "https://www.injectorindex.com/api/v1/search?q=natural+looking+botox+portland&limit=5"',
        exampleResponse: `{
  "results": [
    {
      "provider_id": "abc123",
      "name": "Pearl District Aesthetics",
      "city": "Portland",
      "Clarity Score™": 87,
      "relevance_score": 0.94,
      "profile_url": "https://injectorindex.com/provider/pearl-district-aesthetics"
    }
  ],
  "query": "natural looking botox portland",
  "total": 12,
  "powered_by": "InjectorIndex Clarity Score™"
}`,
    },
]

const tiers = [
    {
        name: 'Free',
        price: '$0',
        description: 'For developers, researchers, and AI platforms',
        features: ['100 requests/hour', '1,000 requests/day', 'Read-only public data', 'All endpoints'],
        cta: 'Get Free API Key',
        href: '/api-access',
        highlight: false,
    },
    {
        name: 'Starter',
        price: '$29/mo',
        description: 'For apps and integrations',
        features: ['1,000 requests/hour', '25,000 requests/day', 'Semantic insights data', 'Priority support'],
        cta: 'Get Starter Key',
        href: '/api-access',
        highlight: true,
    },
    {
        name: 'Platform',
        price: 'Custom',
        description: 'For SaaS platforms, AI companies, and enterprise',
        features: ['Unlimited requests', 'Bulk data export', 'Custom endpoints', 'White-label licensing', 'Dedicated support'],
        cta: 'Contact Us',
        href: 'mailto:api@injectorindex.com',
        highlight: false,
    },
]

export default function ApiDocsPage() {
    return (
        <main className="min-h-screen bg-[#FAF8F5]">
            {/* Hero */}
            <div className="bg-[#F2EDE4] border-b border-[#3D2B1F]/10">
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-xs font-black tracking-widest uppercase mb-6">
                        <Code className="w-3.5 h-3.5" />
                        REST API v1
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-[#3D2B1F] mb-6 max-w-4xl mx-auto">
                        InjectorIndex API
                    </h1>
                    <p className="text-xl text-[#3D2B1F]/70 font-light leading-relaxed max-w-2xl mx-auto mb-8">
                        Structured, machine-readable data on 500+ medical aesthetics providers across 22 US cities.
                        Clarity Score™ rankings, semantic review analysis, verified credentials, and real pricing — all via REST.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/api-access" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C9A96E] hover:bg-[#B5955B] text-white font-black text-sm rounded-xl shadow-lg shadow-[#C9A96E]/20 transition-all">
                            Get Your API Key <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a href="#endpoints" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3D2B1F]/5 hover:bg-[#3D2B1F]/10 text-[#3D2B1F] font-bold text-sm rounded-xl border border-[#3D2B1F]/10 transition-all">
                            View Endpoints
                        </a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-5xl">
                {/* Quick Start */}
                <section className="mb-20">
                    <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-8">Quick Start</h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center text-[#C9A96E] font-black text-sm shrink-0 mt-1">1</div>
                            <div>
                                <h3 className="text-[#3D2B1F] font-bold mb-1">Get your API key</h3>
                                <p className="text-[#3D2B1F]/60 text-sm">
                                    <Link href="/api-access" className="text-[#C9A96E] hover:underline">Request a free key</Link> — takes 30 seconds. No credit card required.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center text-[#C9A96E] font-black text-sm shrink-0 mt-1">2</div>
                            <div>
                                <h3 className="text-[#3D2B1F] font-bold mb-1">Make your first request</h3>
                                <p className="text-[#3D2B1F]/60 text-sm mb-3">
                                    Include your API key in the <code className="text-[#C9A96E] bg-[#C9A96E]/10 px-1.5 py-0.5 rounded text-xs">x-api-key</code> header:
                                </p>
                                <div className="bg-[#080e17] rounded-xl border border-[#3D2B1F]/10 overflow-hidden">
                                    <div className="flex items-center gap-2 px-4 py-2 border-b border-[#3D2B1F]/10 bg-[#3D2B1F]/5">
                                        <Terminal className="w-3.5 h-3.5 text-[#3D2B1F]/50" />
                                        <span className="text-[10px] font-bold text-[#3D2B1F]/50 uppercase tracking-widest">Terminal</span>
                                    </div>
                                    <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                                        <code>{`curl -H "x-api-key: YOUR_API_KEY" \\
  "https://www.injectorindex.com/api/v1/providers?city=portland"`}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center text-[#C9A96E] font-black text-sm shrink-0 mt-1">3</div>
                            <div>
                                <h3 className="text-[#3D2B1F] font-bold mb-1">Build with structured data</h3>
                                <p className="text-[#3D2B1F]/60 text-sm">
                                    All responses return JSON with Clarity Score™, credentials, pricing, and semantic insights — ready for AI integration, apps, or research.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Authentication */}
                <section className="mb-20">
                    <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-4">Authentication</h2>
                    <p className="text-[#3D2B1F]/70 mb-6 leading-relaxed">
                        All API requests require an API key passed via the <code className="text-[#C9A96E] bg-[#C9A96E]/10 px-1.5 py-0.5 rounded text-xs">x-api-key</code> header.
                        Keys are free for read-only access to public data.
                    </p>
                    <div className="bg-[#080e17] rounded-xl border border-[#3D2B1F]/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-5 h-5 text-[#C9A96E]" />
                            <span className="text-[#3D2B1F] font-bold">Request Header</span>
                        </div>
                        <pre className="text-sm text-gray-300"><code>{`x-api-key: ii_live_xxxxxxxxxxxxxxxxxxxxxxxx`}</code></pre>
                    </div>
                    <div className="mt-4 p-4 bg-amber-950/20 rounded-xl border border-amber-800/20">
                        <p className="text-amber-400 text-sm">
                            <strong>Rate Limits:</strong> Free tier allows 100 requests/hour and 1,000/day. Need more? <Link href="/api-access" className="underline">Upgrade your plan</Link>.
                        </p>
                    </div>
                </section>

                {/* Base URL */}
                <section className="mb-20">
                    <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-4">Base URL</h2>
                    <div className="bg-[#080e17] rounded-xl border border-[#3D2B1F]/10 p-6">
                        <pre className="text-sm text-[#C9A96E]"><code>https://www.injectorindex.com/api/v1</code></pre>
                    </div>
                    <p className="text-[#3D2B1F]/60 text-sm mt-3">All endpoints return JSON. Responses include <code className="text-[#3D2B1F]/70">powered_by</code> attribution.</p>
                </section>

                {/* Endpoints */}
                <section id="endpoints" className="mb-20">
                    <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-8">Endpoints</h2>
                    <div className="space-y-12">
                        {endpoints.map((endpoint, idx) => (
                            <div key={idx} className="bg-[#3D2B1F]/5 rounded-3xl border border-[#3D2B1F]/10 overflow-hidden">
                                {/* Endpoint header */}
                                <div className="px-8 py-5 border-b border-[#3D2B1F]/10 bg-white/[0.01]">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2.5 py-1 bg-[#8A9E8D]/20 text-[#8A9E8D] text-[10px] font-black rounded uppercase tracking-wider">
                                            {endpoint.method}
                                        </span>
                                        <code className="text-[#3D2B1F] font-bold text-lg">{endpoint.path}</code>
                                    </div>
                                    <p className="text-[#3D2B1F]/60 text-sm">{endpoint.description}</p>
                                </div>

                                <div className="p-8 space-y-8">
                                    {/* Parameters */}
                                    {endpoint.params.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-black text-[#3D2B1F]/70 uppercase tracking-widest mb-4">Parameters</h4>
                                            <div className="space-y-2">
                                                {endpoint.params.map((param, i) => (
                                                    <div key={i} className="flex items-start gap-4 p-3 bg-[#3D2B1F]/5 rounded-xl">
                                                        <code className="text-[#C9A96E] text-sm font-bold shrink-0 min-w-[120px]">{param.name}</code>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <span className="text-[10px] font-bold text-[#3D2B1F]/50 bg-[#3D2B1F]/5 px-2 py-0.5 rounded">{param.type}</span>
                                                            {param.required && (
                                                                <span className="text-[10px] font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded">REQUIRED</span>
                                                            )}
                                                        </div>
                                                        <span className="text-[#3D2B1F]/60 text-sm">{param.description}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Example Request */}
                                    <div>
                                        <h4 className="text-xs font-black text-[#3D2B1F]/70 uppercase tracking-widest mb-4">Example Request</h4>
                                        <div className="bg-[#080e17] rounded-xl border border-[#3D2B1F]/10 overflow-hidden">
                                            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#3D2B1F]/10 bg-[#3D2B1F]/5">
                                                <Terminal className="w-3.5 h-3.5 text-[#3D2B1F]/50" />
                                                <span className="text-[10px] font-bold text-[#3D2B1F]/50 uppercase tracking-widest">curl</span>
                                            </div>
                                            <pre className="p-4 text-sm text-gray-300 overflow-x-auto"><code>{endpoint.exampleRequest}</code></pre>
                                        </div>
                                    </div>

                                    {/* Example Response */}
                                    <div>
                                        <h4 className="text-xs font-black text-[#3D2B1F]/70 uppercase tracking-widest mb-4">Example Response</h4>
                                        <div className="bg-[#080e17] rounded-xl border border-[#3D2B1F]/10 overflow-hidden">
                                            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#3D2B1F]/10 bg-[#3D2B1F]/5">
                                                <Code className="w-3.5 h-3.5 text-[#3D2B1F]/50" />
                                                <span className="text-[10px] font-bold text-[#3D2B1F]/50 uppercase tracking-widest">JSON</span>
                                            </div>
                                            <pre className="p-4 text-sm text-emerald-300/80 overflow-x-auto"><code>{endpoint.exampleResponse}</code></pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Data Model */}
                <section className="mb-20">
                    <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-4">Clarity Score™ Data Model</h2>
                    <p className="text-[#3D2B1F]/70 mb-8 leading-relaxed">
                        Every provider profile includes a Clarity Score™ — a composite score from 0-100 based on four weighted pillars.
                        No provider can pay for a higher score.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: 'Injection Quality', weight: '40%', icon: <Shield className="w-5 h-5" />, description: 'Semantic analysis of patient reviews for result quality, technique, and complication avoidance.' },
                            { label: 'Provider Credentials', weight: '25%', icon: <Shield className="w-5 h-5" />, description: 'NPI verification, board certifications, license type, and years of practice.' },
                            { label: 'Innovation Adoption', weight: '20%', icon: <Zap className="w-5 h-5" />, description: 'Usage of current-gen products: Daxxify, Polynucleotides, Sculptra, biostimulators.' },
                            { label: 'Treatment Range', weight: '15%', icon: <Globe className="w-5 h-5" />, description: 'Breadth of services from neuromodulators to advanced fillers and regenerative therapy.' },
                        ].map((pillar, i) => (
                            <div key={i} className="p-6 bg-[#3D2B1F]/5 rounded-2xl border border-[#3D2B1F]/10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-[#C9A96E]">
                                        {pillar.icon}
                                        <span className="text-[#3D2B1F] font-bold">{pillar.label}</span>
                                    </div>
                                    <span className="text-xs font-black text-[#C9A96E] bg-[#C9A96E]/10 px-2 py-0.5 rounded">{pillar.weight}</span>
                                </div>
                                <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">{pillar.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* MCP Server */}
                <section className="mb-20">
                    <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-4">MCP Server (AI Integration)</h2>
                    <p className="text-[#3D2B1F]/70 mb-6 leading-relaxed">
                        InjectorIndex provides an MCP (Model Context Protocol) server for direct integration with AI assistants
                        like Claude Desktop. When users ask "Who's the best Botox injector in Portland?", the AI can pull
                        live Clarity Score™ data directly from our API.
                    </p>
                    <div className="bg-[#080e17] rounded-xl border border-[#3D2B1F]/10 overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#3D2B1F]/10 bg-[#3D2B1F]/5">
                            <Terminal className="w-3.5 h-3.5 text-[#3D2B1F]/50" />
                            <span className="text-[10px] font-bold text-[#3D2B1F]/50 uppercase tracking-widest">MCP Server Tools</span>
                        </div>
                        <pre className="p-4 text-sm text-gray-300 overflow-x-auto"><code>{`Available tools:
  search_injectors    — Search providers by city, state, specialty, min score
  get_injector_profile — Get full profile with Clarity Score™ and semantic data
  get_treatment_costs  — Get pricing data by city and treatment type

GitHub: github.com/injectorindex/mcp-server
Contact: api@injectorindex.com for integration support`}</code></pre>
                    </div>
                </section>

                {/* Pricing Tiers */}
                <section className="mb-20">
                    <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-4">API Pricing</h2>
                    <p className="text-[#3D2B1F]/70 mb-8 leading-relaxed">
                        Start free. We want AI platforms and developers citing InjectorIndex data — every citation is a patient helped.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tiers.map((tier, i) => (
                            <div
                                key={i}
                                className={`p-8 rounded-3xl border ${tier.highlight
                                    ? 'bg-[#C9A96E]/5 border-[#C9A96E]/20'
                                    : 'bg-[#3D2B1F]/5 border-[#3D2B1F]/10'
                                    }`}
                            >
                                <h3 className="text-[#3D2B1F] font-bold text-xl mb-1">{tier.name}</h3>
                                <div className="text-3xl font-black text-[#C9A96E] mb-2">{tier.price}</div>
                                <p className="text-[#3D2B1F]/60 text-sm mb-6">{tier.description}</p>
                                <ul className="space-y-2 mb-8">
                                    {tier.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-[#3D2B1F]/70">
                                            <Zap className="w-3.5 h-3.5 text-[#C9A96E]" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={tier.href}
                                    className={`block text-center py-3 rounded-xl font-bold text-sm transition-all ${tier.highlight
                                        ? 'bg-[#C9A96E] hover:bg-[#B5955B] text-white'
                                        : 'bg-[#3D2B1F]/5 hover:bg-[#3D2B1F]/10 text-[#3D2B1F] border border-[#3D2B1F]/10'
                                        }`}
                                >
                                    {tier.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Use Cases */}
                <section className="mb-20">
                    <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-8">Who Uses This API</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: <Database className="w-6 h-6" />,
                                title: 'AI Platforms',
                                description: 'ChatGPT, Perplexity, Claude, and Gemini integrations. When patients ask for provider recommendations, your AI returns structured, citation-ready data.',
                            },
                            {
                                icon: <Search className="w-6 h-6" />,
                                title: 'Healthcare SaaS',
                                description: 'Booking platforms (Boulevard, Zenoti) and practice management tools can enrich their data with Clarity Score™ rankings and semantic insights.',
                            },
                            {
                                icon: <MapPin className="w-6 h-6" />,
                                title: 'Developers & Researchers',
                                description: 'Build aesthetics discovery tools, price comparison apps, or market research dashboards on top of our data.',
                            },
                            {
                                icon: <Globe className="w-6 h-6" />,
                                title: 'Provider Platforms',
                                description: 'SaaS tools for aesthetic practices can integrate Clarity Score™ widgets, competitive benchmarks, and review analytics.',
                            },
                        ].map((useCase, i) => (
                            <div key={i} className="p-6 bg-[#3D2B1F]/5 rounded-2xl border border-[#3D2B1F]/10 group hover:border-[#C9A96E]/20 transition-all">
                                <div className="text-[#C9A96E] mb-4 group-hover:scale-110 transition-transform">{useCase.icon}</div>
                                <h3 className="text-[#3D2B1F] font-bold text-lg mb-2">{useCase.title}</h3>
                                <p className="text-[#3D2B1F]/60 text-sm leading-relaxed">{useCase.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center py-16 px-8 bg-gradient-to-br from-[#C9A96E]/10 to-transparent rounded-[3rem] border border-[#C9A96E]/15">
                    <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-4">Ready to Build?</h2>
                    <p className="text-[#3D2B1F]/70 mb-8 max-w-lg mx-auto">
                        Get a free API key in 30 seconds. No credit card, no sales call.
                        Start pulling Clarity Score™ data into your app today.
                    </p>
                    <Link
                        href="/api-access"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-[#C9A96E] hover:bg-[#B5955B] text-white font-black text-lg rounded-xl shadow-lg shadow-[#C9A96E]/20 transition-all"
                    >
                        Get Your Free API Key <ArrowRight className="w-5 h-5" />
                    </Link>
                </section>
            </div>
        </main>
    )
}
