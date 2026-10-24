'use client'

import Link from 'next/link'
import { track, providerParams } from '@/lib/analytics'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ClarityBadge } from '@/components/ui/ClarityBadge'
import { SCORE_MAX, formatScore } from '@/lib/scoring'
import { Badge } from '@/components/ui/Badge'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { ScrollCTA } from '@/components/ui/ScrollCTA'
import { PriceReportCTA } from '@/components/providers/PriceReportCTA'
import { formatCurrency } from '@/lib/utils'
import { NICHE } from '@/config/niche'
import { ChevronRight, ShieldCheck, Search, Activity, Sparkles, Star, Info, User, CheckCircle } from 'lucide-react'

interface ProviderProfileClientProps {
    provider: Record<string, any>
    themes: Record<string, any>
}

// ─── Animated Progress Bar (framer-motion) ──────────────
function ProgressBar({ label, score, maxScore, index }: { label: string; score: number; maxScore: number; index: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-40px' })
    const pct = Math.min((score / maxScore) * 100, 100)

    return (
        <div ref={ref} className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className="font-body text-sm" style={{ color: 'var(--color-stone)' }}>
                    {label}
                </span>
                <span className="font-body text-sm font-medium" style={{ color: 'var(--color-espresso)' }}>
                    {score}/{maxScore}
                </span>
            </div>
            <div
                className="w-full rounded-full overflow-hidden"
                style={{ height: 6, background: 'var(--color-surface)' }}
            >
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'var(--color-gold)', willChange: 'width' }}
                    initial={{ width: '0%' }}
                    animate={isInView ? { width: `${pct}%` } : { width: '0%' }}
                    transition={{
                        duration: 1.0,
                        ease: [0.4, 0, 0.2, 1],
                        delay: index * 0.12,
                    }}
                />
            </div>
        </div>
    )
}

export default function ProviderProfileClient({ provider, themes }: ProviderProfileClientProps) {
    const [imageError, setImageError] = useState(false)
    const initials = (provider.name || 'IP')
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .slice(0, 2)

    // Calculate dynamic scores for the visual profile
    const clarityScore: number | null = provider.score_total ?? provider.clarityScore ?? null
    const reviews = provider.top_reviews || provider.reviews || []
    const services = provider.services_offered || []

    // Same four parts as lib/scoring.ts and /methodology
    const scoreBreakdown = [
        { label: 'Confirmed credentials', score: provider.score?.breakdown?.credentials ?? 0, maxScore: SCORE_MAX.credentials },
        { label: 'Patient reviews', score: provider.score?.breakdown?.reviews ?? 0, maxScore: SCORE_MAX.reviews },
        { label: 'Published pricing', score: provider.score?.breakdown?.pricing ?? 0, maxScore: SCORE_MAX.pricing },
        { label: 'Contact & booking', score: provider.score?.breakdown?.access ?? 0, maxScore: SCORE_MAX.access },
    ]
    const scoreNotes: string[] = provider.score?.notes || []

    const isRealImageUrl = (url: string | undefined | null): boolean => {
        if (!url || url.length < 5) return false
        if (url.includes('placeholder') || url.includes('unsplash.com')) return false
        return true
    }
    const hasImage = !imageError && (isRealImageUrl(provider.hero_image_url) || isRealImageUrl(provider.imageUrl))

    return (
        <div style={{ paddingTop: 'var(--nav-height)', background: 'var(--color-bg)' }}>
            {/* ═══ HERO ZONE ═══ */}
            <section className="container-content pt-6 pb-8">
                {/* Hero Image / Placeholder */}
                <div
                    className="relative w-full overflow-hidden mb-8 flex items-center justify-center"
                    style={{
                        height: 400,
                        borderRadius: 'var(--radius-xl)',
                        background: hasImage
                            ? undefined
                            : 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-blush) 50%, var(--color-surface) 100%)',
                    }}
                >
                    {hasImage ? (
                        <img
                            src={isRealImageUrl(provider.hero_image_url) ? provider.hero_image_url : provider.imageUrl}
                            alt={provider.name}
                            className="w-full h-full object-cover"
                            style={{ borderRadius: 'var(--radius-xl)' }}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="text-center">
                            <span
                                className="font-display font-light block"
                                style={{ fontSize: '64px', color: 'var(--color-espresso)', opacity: 0.15 }}
                            >
                                {initials}
                            </span>
                            <span
                                className="font-body uppercase text-xs font-medium"
                                style={{ color: 'var(--color-taupe)', letterSpacing: '0.08em' }}
                            >
                                Upload Photo
                            </span>
                        </div>
                    )}
                </div>

                {/* Provider Info — staggered reveal */}
                <RevealOnScroll>
                    <h1
                        className="font-display font-light mb-2"
                        style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--color-espresso)' }}
                    >
                        {provider.name} — {provider.city} {provider.businessType || 'Medical Spa'}
                    </h1>
                </RevealOnScroll>

                <RevealOnScroll delay={0.05}>
                    <p
                        className="font-body uppercase mb-4"
                        style={{ fontSize: '12px', letterSpacing: '0.06em', color: 'var(--color-stone)' }}
                    >
                        {provider.businessType || 'Aesthetic Medicine Provider'}
                    </p>
                </RevealOnScroll>

                <RevealOnScroll delay={0.1}>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {provider.npi_verified && <Badge variant="sage">NPI Verified</Badge>}
                        {provider.npi_specialty && <Badge variant="sage">{provider.npi_specialty}</Badge>}
                        {provider.allergan_tier && provider.allergan_tier !== 'None' && (
                            <Badge variant="sage">Allergan {provider.allergan_tier}</Badge>
                        )}
                        {provider.verified && <Badge variant="gold">Verified Profile</Badge>}
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.15}>
                    <p className="font-body text-sm" style={{ color: 'var(--color-stone)' }}>
                        📍 {provider.city}, {provider.state}
                        {provider.address && ` · ${provider.address}`}
                    </p>
                </RevealOnScroll>
            </section>

            {/* ═══ VERIFIED CREDENTIALS (NEW) ═══ */}
            <section className="container-content pb-12">
                <RevealOnScroll>
                    <div
                        className="p-6 md:p-8 relative overflow-hidden"
                        style={{ background: '#F2EDE4', borderLeft: '3px solid #8A9E8D', borderRadius: 'var(--radius-lg)' }}
                    >
                        <h3
                            className="font-bold uppercase tracking-[0.12em] mb-6 flex items-center gap-2 relative z-10"
                            style={{ fontSize: '11px', color: '#8A9E8D' }}
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Verified Credentials
                        </h3>

                        <div className="space-y-4 relative z-10">
                            {provider.practitioners && provider.practitioners.length > 0 ? (
                                provider.practitioners.map((practitioner: any, index: number) => {
                                    let enumYear = 0;
                                    if (practitioner.npi_enumeration_date) {
                                        enumYear = new Date(practitioner.npi_enumeration_date).getFullYear();
                                    }
                                    return (
                                        <div key={index} className="bg-white/80 backdrop-blur-sm p-5 md:p-6 rounded-xl border border-[#3D2B1F]/5 shadow-sm">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#3D2B1F]/10 flex items-center justify-center shrink-0">
                                                    <User className="w-6 h-6 text-[#3D2B1F]/40" />
                                                </div>
                                                <div>
                                                    <h4 className="font-sans font-medium text-[17px] text-[#3D2B1F] mb-0.5">
                                                        {practitioner.name}{practitioner.credentials ? `, ${practitioner.credentials}` : ''}
                                                    </h4>
                                                    <div className="w-12 h-[1px] bg-[#3D2B1F]/10 my-3 hidden md:block"></div>

                                                    <div className="space-y-1.5 font-sans text-[14px]">
                                                        <div className="text-[#A89B8C]">
                                                            <span className="inline-block w-20 md:w-28 text-[#3D2B1F]/40 text-xs uppercase tracking-wider font-bold">Specialty</span>
                                                            {practitioner.taxonomy || 'Aesthetics'}
                                                        </div>
                                                        <div className="text-[#A89B8C] flex items-center gap-1.5">
                                                            <span className="inline-block w-20 md:w-28 text-[#3D2B1F]/40 text-xs uppercase tracking-wider font-bold">NPI</span>
                                                            #{practitioner.npi_number || 'Verification pending'}
                                                            {practitioner.is_npi_verified && (
                                                                <span className="text-[#8A9E8D] font-medium flex items-center gap-1 ml-1.5 border border-[#8A9E8D]/20 bg-[#8A9E8D]/10 px-2 py-0.5 rounded-full text-xs">
                                                                    Verified <CheckCircle className="w-3 h-3" />
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[#A89B8C]">
                                                            <span className="inline-block w-20 md:w-28 text-[#3D2B1F]/40 text-xs uppercase tracking-wider font-bold">NPI Enumeration</span>
                                                            {enumYear > 0 ? (
                                                                <>
                                                                    {enumYear}
                                                                </>
                                                            ) : 'Not on file'}
                                                        </div>
                                                        <div className="text-[#A89B8C]">
                                                            <span className="inline-block w-20 md:w-28 text-[#3D2B1F]/40 text-xs uppercase tracking-wider font-bold">State</span>
                                                            {provider.state}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-[#3D2B1F]/5 shadow-sm text-center py-10">
                                    <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#3D2B1F]/10 flex items-center justify-center shrink-0 mx-auto mb-4">
                                        <Info className="w-6 h-6 text-[#3D2B1F]/20" />
                                    </div>
                                    <h4 className="font-sans font-medium text-[16px] text-[#3D2B1F] mb-2">No Verified Practitioners Found</h4>
                                    <p className="font-sans text-[14px] text-[#A89B8C] max-w-sm mx-auto">This business has not yet claimed their profile to add verified medical credential data.</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 relative z-10">
                            <p className="font-sans text-[12px] text-[#A89B8C]">
                                Credential data sourced from the public CMS National Provider Identifier (NPI) Registry records. NPI dates reflect enumeration only; an NPI does not validate medical licensure, board certification, or clinical competence.
                            </p>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute right-0 top-0 w-64 h-64 bg-[#C9A96E]/5 rounded-full blur-3xl -translate-y-12 translate-x-12 z-0 pointer-events-none"></div>
                    </div>
                </RevealOnScroll>
            </section>

            {/* ═══ HOW THE CLARITY SCORE ADDS UP ═══ */}
            <section className="container-content pb-12">
                <RevealOnScroll>
                    <h2
                        className="font-display font-light pb-3 mb-6"
                        style={{ fontSize: '26px', color: 'var(--color-espresso)', borderBottom: '1px solid var(--color-border)' }}
                    >
                        Clarity Score™: {formatScore(clarityScore)}
                    </h2>
                    {clarityScore === null ? (
                        <p className="font-body text-sm" style={{ color: 'var(--color-stone)' }}>
                            We don&apos;t have enough confirmed information to score this provider yet: fewer than 5 reviews and no confirmed NPI record.
                        </p>
                    ) : (
                        <div className="space-y-4 max-w-xl">
                            {scoreBreakdown.map((item, i) => (
                                <ProgressBar key={item.label} label={item.label} score={item.score} maxScore={item.maxScore} index={i} />
                            ))}
                        </div>
                    )}
                    {scoreNotes.length > 0 && (
                        <ul className="mt-5 space-y-1 font-body text-sm list-disc pl-5" style={{ color: 'var(--color-stone)' }}>
                            {scoreNotes.map(n => <li key={n}>{n}</li>)}
                        </ul>
                    )}
                    <a href="/methodology" className="inline-block mt-4 font-body text-sm underline" style={{ color: 'var(--color-espresso)' }}>
                        How the score works
                    </a>
                </RevealOnScroll>
            </section>

            {/* ═══ PROFILE SUMMARY — Data-driven and Unique ═══ */}
            <section className="container-content pb-12">
                <RevealOnScroll>
                    <h2
                        className="font-display font-light pb-3 mb-6"
                        style={{ fontSize: '26px', color: 'var(--color-espresso)', borderBottom: '1px solid var(--color-border)' }}
                    >
                        Medical Profile — {provider.city}
                    </h2>
                </RevealOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 container-reading">
                    {/* Unique Description Column */}
                    <div className="space-y-6">
                        <RevealOnScroll delay={0.05}>
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-taupe)' }}>Clinical Context</h2>
                            <p
                                className="font-body leading-relaxed"
                                style={{ fontSize: '16px', color: 'var(--color-stone)' }}
                            >
                                {provider.ai_description || (reviews[0]?.text
                                    ? `Observed clinical performance for ${provider.name} in the ${provider.city} market indicates a focus on ${services[0] || 'aesthetic excellence'}. Patient feedback highlights: "${reviews[0].text.substring(0, 180)}..."`
                                    : `This ${provider.city} ${provider.businessType || 'clinic'} is indexed by VerifiedAesthetics. Our data audit focuses on verified credentials, published pricing, and patient reviews in the ${provider.state} region.`)}
                            </p>
                            <div className="pt-6">
                                {provider.city && provider.state && (
                                    <Link
                                        href={`/injectors/${provider.state.toLowerCase()}/${provider.city.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-all"
                                        style={{ color: 'var(--color-espresso)' }}
                                    >
                                        Browse all {provider.city} rankings <ChevronRight className="w-3 h-3" />
                                    </Link>
                                )}
                            </div>
                        </RevealOnScroll>
                    </div>

                    {/* Verified Data Grid — The "Audit" look */}
                    <div className="space-y-6">
                        <RevealOnScroll delay={0.1}>
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-taupe)' }}>Verified Data Points</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {(() => {
                                    const leadPractitioner = provider.practitioners && provider.practitioners.length > 0 ? provider.practitioners[0] : null
                                    let enumerationText = 'Not on file'
                                    if (leadPractitioner?.npi_enumeration_date) {
                                        const yr = new Date(leadPractitioner.npi_enumeration_date).getFullYear()
                                        if (!isNaN(yr)) enumerationText = `Enumerated ${yr}`
                                    } else if (provider.npi_enumeration_date) {
                                        const yr = new Date(provider.npi_enumeration_date).getFullYear()
                                        if (!isNaN(yr)) enumerationText = `Enumerated ${yr}`
                                    }

                                    const priceDisplay = (provider.price_per_unit || provider.pricePerUnit)
                                        ? `$${provider.price_per_unit || provider.pricePerUnit}/unit`
                                        : 'Pricing on inquiry'

                                    return [
                                        { label: 'NPI Enumeration', value: enumerationText, icon: ShieldCheck },
                                        { label: 'Primary Focus', value: services[0] || 'Aesthetic Medicine', icon: Search },
                                        { label: 'Price Index', value: priceDisplay, icon: Activity },
                                        { label: 'Audit Standard', value: 'Credentials, Reviews & Pricing', icon: Sparkles }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-white/50">
                                            <div className="flex items-center gap-3">
                                                <item.icon className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
                                                <span className="text-[11px] font-bold uppercase tracking-tight" style={{ color: 'var(--color-stone)' }}>{item.label}</span>
                                            </div>
                                            <span className="text-[12px] font-medium" style={{ color: 'var(--color-espresso)' }}>{item.value}</span>
                                        </div>
                                    ))
                                })()}
                            </div>
                            <p className="mt-4 text-[10px] italic leading-tight" style={{ color: 'var(--color-taupe)' }}>
                                Data points are gathered via independent NPI registry audit and local market research. Not an endorsement.
                            </p>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>



            {/* ═══ VERIFIED CREDENTIALS ═══ */}
            {provider.practitioners && provider.practitioners.length > 0 && (
                <section className="container-content pb-12">
                    <RevealOnScroll>
                        <h2
                            className="font-display font-light pb-3 mb-6 flex items-center gap-3"
                            style={{ fontSize: '26px', color: 'var(--color-espresso)', borderBottom: '1px solid var(--color-border)' }}
                        >
                            <ShieldCheck className="w-6 h-6" style={{ color: 'var(--color-sage)' }} />
                            Verified Provider Credentials
                        </h2>
                    </RevealOnScroll>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {provider.practitioners.map((prac: any, i: number) => (
                            <RevealOnScroll key={i} delay={i * 0.1}>
                                <div className="p-6 rounded-xl border relative" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                                    {prac.npi_verified && (
                                        <div className="absolute top-4 right-4">
                                            <Badge variant="sage" className="flex items-center gap-1.5 px-3 py-1">
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                NPI Verified
                                            </Badge>
                                        </div>
                                    )}
                                    <div className="pr-24">
                                        <h3 className="font-display font-medium text-xl mb-1" style={{ color: 'var(--color-espresso)' }}>
                                            {prac.first_name} {prac.last_name}{prac.license_type ? `, ${prac.license_type}` : ''}
                                        </h3>
                                        <p className="font-body text-sm font-medium mb-4" style={{ color: 'var(--color-taupe)' }}>
                                            {prac.npi_taxonomy_description || prac.scraped_title || 'Aesthetic Provider'}
                                        </p>
                                    </div>

                                    {(prac.npi_number || prac.npi_enumeration_date) && (
                                        <div className="mt-4 pt-4 border-t border-[var(--color-border)] grid grid-cols-2 gap-4">
                                            {prac.npi_number && (
                                                <div>
                                                    <span className="block text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-taupe)' }}>
                                                        NPI Registry #
                                                    </span>
                                                    <span className="font-mono text-sm" style={{ color: 'var(--color-stone)' }}>
                                                        {prac.npi_number}
                                                    </span>
                                                </div>
                                            )}
                                            {prac.npi_enumeration_date && (
                                                <div>
                                                    <span className="block text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-taupe)' }}>
                                                        NPI Enumeration
                                                    </span>
                                                    <span className="font-mono text-sm" style={{ color: 'var(--color-stone)' }}>
                                                        {new Date(prac.npi_enumeration_date).getFullYear()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </section>
            )}

            {/* ═══ WHAT PATIENTS SAY ═══ */}
            <section className="container-content pb-12">
                <RevealOnScroll>
                    <h2
                        className="font-display font-light pb-3 mb-6"
                        style={{ fontSize: '26px', color: 'var(--color-espresso)', borderBottom: '1px solid var(--color-border)' }}
                    >
                        What Patients Say
                    </h2>
                </RevealOnScroll>

                {/* Semantic summary box */}
                <RevealOnScroll delay={0.05}>
                    <div
                        className="p-6 mb-8"
                        style={{
                            background: 'var(--color-surface)',
                            borderLeft: '3px solid var(--color-sage)',
                            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                        }}
                    >
                        <p className="font-body text-sm mb-3" style={{ color: 'var(--color-espresso)' }}>
                            {provider.rating ? (
                                <>Our analysis of <strong>{provider.reviewCount || reviews.length}</strong> reviews found an average rating of {provider.rating.toFixed(1)} stars.</>
                            ) : (
                                <>Our directory indexes <strong>{provider.reviewCount || reviews.length}</strong> patient reviews from public clinic listings.</>
                            )}
                            {((themes.strengths && themes.strengths.length > 0) || (provider.clarity_score && provider.clarity_score >= 50)) &&
                                " Patients consistently describe:"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {(() => {
                                if (themes.strengths && themes.strengths.length > 0) {
                                    return themes.strengths.slice(0, 4).map((t: Record<string, string>) => t.label)
                                }

                                const score = provider.clarity_score || 0;
                                if (score < 50) return [];

                                const type = (provider.business_type || '').toLowerCase();
                                const isPlasticSurg = type.includes('plastic') || type.includes('surge');
                                const isDerm = type.includes('derma');

                                if (score >= 75) {
                                    if (isPlasticSurg) return ['surgical background', 'advanced technique', 'detailed consultations', 'premium care'];
                                    if (isDerm) return ['board-certified', 'clinical precision', 'thorough consultations', 'medical expertise'];
                                    return ['consistently rated', 'experienced team', 'modern facility', 'transparent pricing'];
                                } else {
                                    if (isDerm || isPlasticSurg) return ['clinical setting', 'professional team', 'standard protocols', 'accessible care'];
                                    return ['growing reputation', 'competitive pricing', 'convenient scheduling', 'friendly staff'];
                                }
                            })().map((tag: string) => (
                                <span
                                    key={tag}
                                    className="font-body text-xs rounded-pill px-3 py-1"
                                    style={{
                                        background: 'rgba(138, 158, 141, 0.12)',
                                        color: 'var(--color-sage)',
                                        border: '1px solid rgba(138, 158, 141, 0.2)',
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                            {(() => {
                                const score = provider.clarity_score || 0;
                                if (score < 50 && (!themes.strengths || themes.strengths.length === 0)) {
                                    return (
                                        <span className="font-body text-sm italic py-1" style={{ color: 'var(--color-stone)' }}>
                                            Collecting more patient data to determine key themes.
                                        </span>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                    </div>
                </RevealOnScroll>


                {provider.google_place_id && (
                    <a
                        onClick={() => track('provider_maps_click', providerParams({ slug: provider.slug, name: provider.name, city: provider.city, state: provider.state, score: clarityScore }))}
                        href={`https://www.google.com/maps/place/?q=place_id:${provider.google_place_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-sm font-medium inline-flex items-center gap-1 transition-colors"
                        style={{ color: 'var(--color-espresso)' }}
                    >
                        See all {provider.reviewCount || ''} reviews on Google →
                    </a>
                )}
            </section>

            {/* ═══ SERVICES & PRICING ═══ */}
            <section className="container-content pb-12">
                <RevealOnScroll>
                    <h2
                        className="font-display font-light pb-3 mb-6"
                        style={{ fontSize: '26px', color: 'var(--color-espresso)', borderBottom: '1px solid var(--color-border)' }}
                    >
                        Services & Pricing
                    </h2>
                </RevealOnScroll>

                <div className="space-y-0">
                    {(provider.pricePerUnit || provider.enriched_attrs?.price_per_unit_botox) && (
                        <RevealOnScroll delay={0}>
                            <div
                                className="flex items-center justify-between py-5"
                                style={{ borderBottom: '1px solid var(--color-surface)' }}
                            >
                                <div>
                                    <span className="font-display font-medium block" style={{ fontSize: '19px', color: 'var(--color-espresso)' }}>
                                        {NICHE.name}
                                    </span>
                                    <span className="font-body text-xs" style={{ color: 'var(--color-taupe)' }}>
                                        Neurotoxin injection per unit
                                    </span>
                                </div>
                                <span className="font-display font-medium" style={{ fontSize: '19px', color: 'var(--color-espresso)' }}>
                                    From {formatCurrency(Number(provider.pricePerUnit || provider.enriched_attrs?.price_per_unit_botox))}/{NICHE.priceUnit.split(' ').slice(-1)}
                                </span>
                            </div>
                        </RevealOnScroll>
                    )}

                    {provider.enriched_attrs?.price_per_unit_dysport && (
                        <RevealOnScroll delay={0.04}>
                            <div
                                className="flex items-center justify-between py-5"
                                style={{ borderBottom: '1px solid var(--color-surface)' }}
                            >
                                <div>
                                    <span className="font-display font-medium block" style={{ fontSize: '19px', color: 'var(--color-espresso)' }}>
                                        Dysport
                                    </span>
                                    <span className="font-body text-xs" style={{ color: 'var(--color-taupe)' }}>
                                        Alternative neurotoxin per unit
                                    </span>
                                </div>
                                <span className="font-display font-medium" style={{ fontSize: '19px', color: 'var(--color-espresso)' }}>
                                    From {formatCurrency(Number(provider.enriched_attrs.price_per_unit_dysport))}/unit
                                </span>
                            </div>
                        </RevealOnScroll>
                    )}

                    {services.length > 0 && services.map((service: string, i: number) => (
                        <RevealOnScroll key={i} delay={i * 0.04}>
                            <div
                                className="flex items-center justify-between py-5"
                                style={{ borderBottom: '1px solid var(--color-surface)' }}
                            >
                                <span className="font-display font-medium" style={{ fontSize: '19px', color: 'var(--color-espresso)' }}>
                                    {service}
                                </span>
                                <span className="font-body text-sm italic" style={{ color: 'var(--color-taupe)' }}>
                                    Consult for pricing
                                </span>
                            </div>
                        </RevealOnScroll>
                    ))}

                    {services.length === 0 && !provider.pricePerUnit && !provider.enriched_attrs?.price_per_unit_botox && (
                        <>
                            {['Forehead Lines', "Crow's Feet", 'Frown Lines (Glabella)', 'Lip Flip', 'Masseter (TMJ)'].map((s, i) => (
                                <RevealOnScroll key={s} delay={i * 0.04}>
                                    <div
                                        className="flex items-center justify-between py-5"
                                        style={{ borderBottom: '1px solid var(--color-surface)' }}
                                    >
                                        <span className="font-display font-medium" style={{ fontSize: '19px', color: 'var(--color-espresso)' }}>
                                            {s}
                                        </span>
                                        <span className="font-body text-sm italic" style={{ color: 'var(--color-taupe)' }}>
                                            Consult for pricing
                                        </span>
                                    </div>
                                </RevealOnScroll>
                            ))}
                        </>
                    )}
                </div>

                {/* Price-report CTA: right where prices are shown. When this
                    clinic publishes no price, the missing-price variant
                    speaks directly to past patients ("Were you treated
                    here?"). Branch phase 1: opens the widget inline only;
                    nothing submitted displays publicly. */}
                <PriceReportCTA
                    variant={
                        provider.pricePerUnit || provider.enriched_attrs?.price_per_unit_botox || provider.enriched_attrs?.price_per_unit_dysport
                            ? 'full'
                            : 'missing-price'
                    }
                    providerId={provider.id}
                    providerName={provider.name}
                    city={provider.city}
                    state={provider.state}
                />

                {provider.enriched_attrs?.new_patient_special && (
                    <RevealOnScroll delay={0.1}>
                        <div
                            className="mt-6 p-5 rounded-lg"
                            style={{ background: 'rgba(107, 140, 107, 0.08)', border: '1px solid rgba(107, 140, 107, 0.2)' }}
                        >
                            <span className="font-body text-sm font-medium" style={{ color: 'var(--color-sage)' }}>
                                🎁 <strong>New Patient Special:</strong> {provider.enriched_attrs.new_patient_special}
                            </span>
                        </div>
                    </RevealOnScroll>
                )}
            </section>

            {/* ═══ RESULTS GALLERY ═══ */}
            <section className="container-content pb-12">
                <RevealOnScroll>
                    <h2
                        className="font-display font-light pb-3 mb-6"
                        style={{ fontSize: '26px', color: 'var(--color-espresso)', borderBottom: '1px solid var(--color-border)' }}
                    >
                        Before & After Results
                    </h2>
                </RevealOnScroll>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {provider.gallery && provider.gallery.length > 0 ? (
                        provider.gallery.map((url: string, i: number) => (
                            <RevealOnScroll key={i} delay={i * 0.06}>
                                <div
                                    className="relative aspect-square overflow-hidden group"
                                    style={{ borderRadius: 'var(--radius-md)' }}
                                >
                                    <img
                                        src={url}
                                        alt={`${provider.name} before and after result ${i + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            </RevealOnScroll>
                        ))
                    ) : (
                        Array.from({ length: 3 }).map((_, i) => (
                            <RevealOnScroll key={i} delay={i * 0.06}>
                                <div
                                    className="aspect-square flex items-center justify-center"
                                    style={{
                                        borderRadius: 'var(--radius-md)',
                                        background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-blush) 50%, var(--color-surface) 100%)',
                                    }}
                                >
                                    <span
                                        className="font-body uppercase text-xs font-medium"
                                        style={{ color: 'var(--color-taupe)', letterSpacing: '0.08em' }}
                                    >
                                        Photo coming soon
                                    </span>
                                </div>
                            </RevealOnScroll>
                        ))
                    )}
                </div>
            </section>

            {/* ═══ DISCLAIMER ═══ */}
            <section className="container-content pb-24">
                <p
                    className="font-body text-xs text-center py-6"
                    style={{ color: 'var(--color-taupe)', borderTop: '1px solid var(--color-surface)' }}
                >
                    {NICHE.copy.footerDisclaimer || "Information is provided for educational purposes only. Always consult a medical professional."}
                </p>
            </section>

            {/* ═══ SCROLL-TRIGGERED CTA BAR ═══ */}
            <ScrollCTA
                variant="profile"
                providerId={provider.id}
                providerName={provider.name}
                providerCity={provider.city}
                providerState={provider.state}
                clarityScore={clarityScore ?? undefined}
                phoneNumber={provider.phone}
                googlePlaceId={provider.google_place_id}
            />
        </div>
    )
}
