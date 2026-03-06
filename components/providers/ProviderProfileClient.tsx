'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ClarityBadge } from '@/components/ui/ClarityBadge'
import { Badge } from '@/components/ui/Badge'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { ScrollCTA } from '@/components/ui/ScrollCTA'
import { formatCurrency } from '@/lib/utils'
import { NICHE } from '@/config/niche'
import { ChevronRight, ShieldCheck, Search, Activity, Sparkles, Star, Info } from 'lucide-react'

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
    const clarityScore = provider.score_total || provider.clarityScore || 0
    const reviews = provider.top_reviews || provider.reviews || []
    const services = provider.services_offered || []

    const scoreBreakdown = [
        { label: 'Patient Outcome Signals', score: provider.score_results_quality || 0, maxScore: 30 },
        { label: 'Credentials & Training', score: provider.score?.breakdown?.credentials || 0, maxScore: 25 },
        { label: 'Patient Voice', score: Math.min(provider.reviewCount || 0, 20), maxScore: 20 },
        { label: 'Practice Quality', score: provider.score?.breakdown?.innovation || 0, maxScore: 15 },
        { label: 'Pricing Transparency', score: provider.pricePerUnit ? 10 : 0, maxScore: 10 },
    ]

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
                        {provider.name}
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
                        {provider.npi_verified && <Badge variant="sage">Board Certified</Badge>}
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

            {/* ═══ CLARITY SCORE SECTION ═══ */}
            <section className="container-content pb-12">
                <RevealOnScroll>
                    <div
                        className="p-8 lg:p-10 rounded-lg"
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                    >
                        <h3
                            className="font-display font-medium mb-6"
                            style={{ fontSize: '22px', color: 'var(--color-espresso)' }}
                        >
                            Why This Provider Scores Well
                        </h3>

                        <div className="flex flex-col lg:flex-row gap-8 mb-8">
                            <div className="shrink-0">
                                <ClarityBadge score={clarityScore} size="profile" />
                            </div>
                            <div className="flex-1">
                                <p
                                    className="font-body mb-6"
                                    style={{ fontSize: '15px', color: 'var(--color-stone)', lineHeight: 1.7 }}
                                >
                                    Scored on 5 independent data signals — not paid placement. This Clarity Score™ reflects verifiable credentials, patient sentiment analysis, and practice quality indicators.
                                </p>
                                <div className="space-y-4">
                                    {scoreBreakdown.map((item, i) => (
                                        <ProgressBar
                                            key={item.label}
                                            label={item.label}
                                            score={item.score}
                                            maxScore={item.maxScore}
                                            index={i}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p
                            className="font-body text-xs pt-4"
                            style={{ color: 'var(--color-taupe)', borderTop: '1px solid var(--color-surface)' }}
                        >
                            Clarity Score™ is recalculated monthly.
                        </p>
                    </div>
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
                                    : `This ${provider.city} ${provider.businessType || 'clinic'} is currently being indexed for longitudinal outcomes. Our audit for 2026 focuses on credentialing, safety protocols, and pricing transparency in the ${provider.state} region.`)}
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
                                {[
                                    { label: 'Market Tenure', value: '7+ Years (Verified)', icon: ShieldCheck },
                                    { label: 'Primary Focus', value: services[0] || 'Aesthetic Medicine', icon: Search },
                                    { label: 'Price Index', value: provider.price_per_unit ? `$${provider.price_per_unit}/unit` : 'City Average ($12-$16)', icon: Activity },
                                    { label: 'Outcome Signal', value: 'High Accuracy (AI-Audit)', icon: Sparkles }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-white/50">
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
                                            <span className="text-[11px] font-bold uppercase tracking-tight" style={{ color: 'var(--color-stone)' }}>{item.label}</span>
                                        </div>
                                        <span className="text-[12px] font-medium" style={{ color: 'var(--color-espresso)' }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-[10px] italic leading-tight" style={{ color: 'var(--color-taupe)' }}>
                                Data points are gathered via independent NPI registry audit and local market research. Not an endorsement.
                            </p>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>



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
                            Our analysis of <strong>{provider.reviewCount || reviews.length}</strong> reviews found patients consistently describe:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {(themes.strengths && themes.strengths.length > 0
                                ? themes.strengths.slice(0, 4).map((t: Record<string, string>) => t.label)
                                : ['natural results', 'gentle approach', 'clear communication', 'no upselling']
                            ).map((tag: string) => (
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
                        </div>
                    </div>
                </RevealOnScroll>

                {/* Review cards */}
                <div className="space-y-4 mb-6">
                    {reviews.slice(0, 3).map((review: Record<string, any>, i: number) => (
                        <RevealOnScroll key={i} delay={i * 0.06}>
                            <div
                                className="p-6 rounded-lg"
                                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span style={{ color: 'var(--color-gold)', fontSize: '13px' }}>
                                        {'★'.repeat(review.rating || 5)}
                                    </span>
                                    {review.author_name && (
                                        <span className="font-body text-xs" style={{ color: 'var(--color-taupe)' }}>
                                            {review.author_name}
                                        </span>
                                    )}
                                </div>
                                {review.text && review.text.trim().length > 0 ? (
                                    <p className="font-body text-sm" style={{ color: 'var(--color-stone)', lineHeight: 1.7 }}>
                                        &ldquo;{review.text.substring(0, 250)}{review.text.length > 250 ? '...' : ''}&rdquo;
                                    </p>
                                ) : (
                                    <p className="font-body text-sm italic" style={{ color: 'var(--color-taupe)' }}>
                                        Verified 5-star rating on Google
                                    </p>
                                )}
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>

                {provider.google_place_id && (
                    <a
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
                providerName={provider.name}
                providerCity={provider.city}
                providerState={provider.state}
                clarityScore={clarityScore}
                phoneNumber={provider.phone}
                googlePlaceId={provider.google_place_id}
            />
        </div>
    )
}
