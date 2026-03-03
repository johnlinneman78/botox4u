'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { ProviderCard } from '@/components/ui/ProviderCard'
import { Button } from '@/components/ui/Button'
import { QuizBanner } from '@/components/lead-funnel/QuizBanner'
import { MorphingHeadline } from '@/components/ui/MorphingHeadline'
import { TreatmentExplorer } from '@/components/ui/TreatmentExplorer'
import { StatementSection } from '@/components/sections/StatementSection'
import { ScrollCTA } from '@/components/ui/ScrollCTA'

// ─── PLACEHOLDER DATA ────────────────────────────────────
const placeholderProviders = [
    {
        name: 'Dr. Sarah Chen',
        credentials: 'MD, Board Certified Dermatologist',
        specialties: ['Botox', 'Lip Filler', 'Sculptra'],
        outcomeTag: 'Natural Results',
        location: 'New York, NY',
        distance: '2.3 mi',
        clarityScore: 94,
        starRating: 4.9,
        profileUrl: '/provider/dr-sarah-chen',
    },
    {
        name: 'Dr. James Rivera',
        credentials: 'DO, Facial Aesthetics Specialist',
        specialties: ['Cheek Filler', 'Daxxify', 'PRP'],
        location: 'Los Angeles, CA',
        distance: '5.1 mi',
        clarityScore: 88,
        starRating: 4.8,
        profileUrl: '/provider/dr-james-rivera',
    },
    {
        name: 'Dr. Anika Patel',
        credentials: 'MD, Oculoplastic Surgeon',
        specialties: ['Under-Eye Filler', 'Botox', 'Polynucleotides'],
        outcomeTag: 'Conservative Approach',
        location: 'Miami, FL',
        distance: '1.8 mi',
        clarityScore: 91,
        starRating: 4.9,
        profileUrl: '/provider/dr-anika-patel',
    },
]

const cities = [
    'New York', 'Los Angeles', 'Miami', 'Chicago', 'Portland', 'Seattle',
    'Scottsdale', 'Dallas', 'Austin', 'Denver', 'Nashville', 'Atlanta',
    'San Francisco', 'Boston', 'Houston', 'Charlotte',
]

const trustStats = [
    { number: '500+', label: 'Verified Providers' },
    { number: '22', label: 'Cities & Growing' },
    { number: '0', label: 'Pay-to-Rank. Ever.' },
    { number: 'AI', label: 'Search Optimized' },
]

const howItWorks = [
    {
        step: '01',
        title: 'Search by City',
        description: 'Tell us your city and what you\'re looking for — Botox, lip filler, Sculptra, or something else entirely.',
    },
    {
        step: '02',
        title: 'Compare Clarity Scores™',
        description: 'Side-by-side Clarity Scores — built from verified reviews, credentials, and outcome signals, not ad spend.',
    },
    {
        step: '03',
        title: 'Book with Confidence',
        description: 'Every provider has been independently scored. You found them because they earned it — not because they paid.',
    },
]

const providerValueProps = [
    {
        emoji: '🤖',
        title: 'Show Up in AI Search Results',
        description: 'When patients ask Perplexity or ChatGPT for Botox recommendations in your city, InjectorIndex providers are the ones that appear.',
    },
    {
        emoji: '✦',
        title: 'Your Clarity Score™ Does the Selling',
        description: 'Patients trust independent scoring over paid ads. A strong Clarity Score™ tells them you earned your reputation — not bought it.',
    },
    {
        emoji: '🔍',
        title: 'Optimized for Google & Local SEO',
        description: 'Your profile is schema-optimized so search engines understand exactly what you offer, where you are, and who you serve.',
    },
]

// Framer motion variants
const heroContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
}

const heroItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" as const },
    },
}

const cardGrid = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
}

const cardItem = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
}

// ─── HOMEPAGE ────────────────────────────────────────────
export default function HomeClient() {
    return (
        <>
            {/* ═══ SECTION 1: HERO ═══ */}
            <section
                className="relative flex items-center justify-center overflow-hidden"
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(160deg, #F2EDE4 0%, #FAF8F5 45%, #EDE5DA 100%)',
                }}
            >
                {/* Decorative orbs */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        width: 500,
                        height: 500,
                        top: '-10%',
                        right: '-5%',
                        background: 'radial-gradient(circle, rgba(232,201,192,0.3) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute pointer-events-none"
                    style={{
                        width: 400,
                        height: 400,
                        bottom: '5%',
                        left: '-8%',
                        background: 'radial-gradient(circle, rgba(138,158,141,0.15) 0%, transparent 70%)',
                    }}
                />

                <motion.div
                    className="container-content text-center relative z-10 py-32"
                    variants={heroContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Eyebrow */}
                    <motion.div variants={heroItem} className="flex justify-center mb-6">
                        <span
                            className="font-body text-xs font-medium rounded-pill px-4 py-2 inline-flex items-center gap-2"
                            style={{
                                background: 'rgba(138, 158, 141, 0.12)',
                                color: 'var(--color-sage)',
                                border: '1px solid rgba(138, 158, 141, 0.2)',
                            }}
                        >
                            Independent · Data-Scored · Ad-Free
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.div variants={heroItem} className="mb-6">
                        <MorphingHeadline />
                    </motion.div>

                    {/* Subheadline */}
                    <motion.div variants={heroItem}>
                        <p
                            className="font-body mx-auto mb-10"
                            style={{
                                fontSize: '18px',
                                color: 'var(--color-stone)',
                                maxWidth: '560px',
                                lineHeight: 1.6,
                            }}
                        >
                            Every provider independently scored for natural results. No ads. No pay-to-play. Just data.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div variants={heroItem}>
                        <div
                            className="mx-auto flex flex-col sm:flex-row items-center gap-3 p-3 rounded-pill"
                            style={{
                                maxWidth: '640px',
                                background: 'rgba(255,255,255,0.88)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid var(--color-border)',
                                boxShadow: 'var(--shadow-xl)',
                            }}
                        >
                            <select
                                className="flex-1 w-full sm:w-auto bg-transparent font-body text-sm px-4 py-3 appearance-none cursor-pointer outline-none"
                                style={{ color: 'var(--color-stone)' }}
                                defaultValue=""
                            >
                                <option value="" disabled>Your city or zip ▾</option>
                                {cities.map((city) => (
                                    <option key={city} value={city.toLowerCase().replace(/\s/g, '-')}>{city}</option>
                                ))}
                            </select>
                            <div className="hidden sm:block w-px h-8" style={{ background: 'var(--color-border)' }} />
                            <select
                                className="flex-1 w-full sm:w-auto bg-transparent font-body text-sm px-4 py-3 appearance-none cursor-pointer outline-none"
                                style={{ color: 'var(--color-stone)' }}
                                defaultValue=""
                            >
                                <option value="" disabled>What are you looking for? ▾</option>
                                <option value="botox">Botox & Dysport</option>
                                <option value="filler">Lip Filler</option>
                                <option value="cheek">Cheek & Jaw Filler</option>
                                <option value="sculptra">Sculptra</option>
                                <option value="daxxify">Daxxify</option>
                            </select>
                            <Link
                                href="/find-providers"
                                className="shrink-0 rounded-full flex items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                style={{
                                    width: 48,
                                    height: 48,
                                    background: 'var(--color-espresso)',
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="var(--color-linen)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Below search */}
                    <motion.div variants={heroItem}>
                        <p
                            className="font-body text-center mt-4"
                            style={{ fontSize: '12px', color: 'var(--color-taupe)' }}
                        >
                            500+ verified Botox & filler providers across 22 cities
                        </p>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-scroll-bounce">
                    <div style={{ width: 1, height: 32, background: 'var(--color-border)' }} />
                    <span
                        className="font-body uppercase"
                        style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--color-taupe)' }}
                    >
                        Scroll
                    </span>
                </div>
            </section>

            {/* ═══ SECTION 2: TRUST STRIP ═══ */}
            <section
                style={{
                    background: 'var(--color-surface)',
                    borderTop: '1px solid var(--color-border)',
                    borderBottom: '1px solid var(--color-border)',
                }}
            >
                <div className="container-content py-6">
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                        {trustStats.map((stat, i) => (
                            <div key={stat.label} className="flex items-center gap-6 md:gap-10">
                                <RevealOnScroll delay={i * 0.08}>
                                    <div className="text-center">
                                        <div
                                            className="font-display font-medium"
                                            style={{ fontSize: '28px', color: 'var(--color-espresso)' }}
                                        >
                                            {stat.number}
                                        </div>
                                        <div
                                            className="font-body uppercase"
                                            style={{ fontSize: '12px', color: 'var(--color-stone)', letterSpacing: '0.04em' }}
                                        >
                                            {stat.label}
                                        </div>
                                    </div>
                                </RevealOnScroll>
                                {i < trustStats.length - 1 && (
                                    <span
                                        className="hidden md:block rounded-full"
                                        style={{ width: 4, height: 4, background: 'var(--color-border)' }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 3: HOW IT WORKS ═══ */}
            <section className="py-20 lg:py-28" id="how-it-works">
                <div className="container-content">
                    <RevealOnScroll>
                        <div className="text-center mb-16">
                            <span
                                className="font-body uppercase font-medium block mb-3"
                                style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--color-sage)' }}
                            >
                                The InjectorIndex Method
                            </span>
                            <h2
                                className="font-display font-light text-balance"
                                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--color-espresso)' }}
                            >
                                Finding the right injector shouldn&apos;t be a guessing game.
                            </h2>
                        </div>
                    </RevealOnScroll>

                    <div
                        className="grid grid-cols-1 md:grid-cols-3"
                        style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}
                    >
                        {howItWorks.map((item, i) => (
                            <RevealOnScroll key={item.step} delay={i * 0.08}>
                                <div
                                    className="relative p-8 lg:p-10"
                                    style={{
                                        borderRight: i < 2 ? '1px solid var(--color-border)' : 'none',
                                    }}
                                >
                                    <span
                                        className="absolute top-4 right-4 font-display font-light select-none pointer-events-none"
                                        style={{ fontSize: '64px', color: 'var(--color-surface)' }}
                                    >
                                        {item.step}
                                    </span>
                                    <div className="relative z-10">
                                        <span
                                            className="font-body uppercase font-medium block mb-2"
                                            style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'var(--color-taupe)' }}
                                        >
                                            Step {item.step}
                                        </span>
                                        <h3
                                            className="font-display font-medium mb-3"
                                            style={{ fontSize: '22px', color: 'var(--color-espresso)' }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p
                                            className="font-body"
                                            style={{ fontSize: '15px', color: 'var(--color-stone)', lineHeight: 1.7 }}
                                        >
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 3.5: TREATMENT EXPLORER ═══ */}
            <TreatmentExplorer />

            {/* ═══ SECTION 4: TOP RATED PROVIDERS ═══ */}
            <section className="py-20 lg:py-28" style={{ background: 'var(--color-surface)' }}>
                <div className="container-content">
                    <RevealOnScroll>
                        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
                            <div>
                                <span
                                    className="font-body uppercase font-medium block mb-3"
                                    style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--color-sage)' }}
                                >
                                    Top Clarity Scores™ This Month
                                </span>
                                <h2
                                    className="font-display font-light"
                                    style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--color-espresso)' }}
                                >
                                    Highest-Rated Botox & Filler Providers Near You
                                </h2>
                            </div>
                            <Link
                                href="/find-providers"
                                className="font-body text-sm font-medium transition-colors shrink-0"
                                style={{ color: 'var(--color-espresso)' }}
                            >
                                See all providers →
                            </Link>
                        </div>
                    </RevealOnScroll>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={cardGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {placeholderProviders.map((provider) => (
                            <motion.div key={provider.name} variants={cardItem}>
                                <ProviderCard {...provider} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══ SECTION 4.5: STATEMENT ═══ */}
            <StatementSection topScore={94} />

            {/* ═══ SECTION 5: QUIZ CTA ═══ */}
            <section className="py-20 lg:py-28">
                <div className="container-content">
                    <RevealOnScroll>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div
                                className="rounded-xl aspect-square lg:aspect-auto lg:h-[420px] flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-blush) 50%, var(--color-surface) 100%)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <div className="text-center">
                                    <span
                                        className="font-display font-light block"
                                        style={{ fontSize: '80px', color: 'rgba(61,43,31,0.08)' }}
                                    >
                                        ?
                                    </span>
                                    <span
                                        className="font-body uppercase text-xs font-medium"
                                        style={{ color: 'var(--color-taupe)', letterSpacing: '0.08em' }}
                                    >
                                        5-Question Match Quiz
                                    </span>
                                </div>
                            </div>
                            <div>
                                <RevealOnScroll>
                                    <span
                                        className="font-body uppercase font-medium block mb-3"
                                        style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--color-sage)' }}
                                    >
                                        Free · 5 Questions · 60 Seconds
                                    </span>
                                </RevealOnScroll>
                                <RevealOnScroll delay={0.05}>
                                    <h2
                                        className="font-display font-light mb-4"
                                        style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--color-espresso)' }}
                                    >
                                        Not sure where to start?
                                    </h2>
                                </RevealOnScroll>
                                <RevealOnScroll delay={0.1}>
                                    <p
                                        className="font-body mb-8"
                                        style={{ fontSize: '16px', color: 'var(--color-stone)', lineHeight: 1.7, maxWidth: '480px' }}
                                    >
                                        Answer 5 quick questions and we&apos;ll match you with providers in your city who fit your goals, budget, and comfort level. No sign-up required.
                                    </p>
                                </RevealOnScroll>
                                <RevealOnScroll delay={0.15}>
                                    <Button variant="primary" size="lg">
                                        Find My Injector Match →
                                    </Button>
                                </RevealOnScroll>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            {/* ═══ SECTION 6: BROWSE BY CITY ═══ */}
            <section className="py-20 lg:py-28" style={{ background: 'var(--color-deep)' }}>
                <div className="container-content">
                    <RevealOnScroll>
                        <h2
                            className="font-display font-light text-center mb-12"
                            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--color-surface)' }}
                        >
                            Find Botox & Filler Injectors by City
                        </h2>
                    </RevealOnScroll>

                    <div className="flex flex-wrap justify-center gap-3">
                        {cities.map((city, i) => (
                            <RevealOnScroll key={city} delay={i * 0.03} y={16}>
                                <Link
                                    href={`/injectors/${city.toLowerCase().replace(/\s/g, '-')}`}
                                    className="font-body text-sm rounded-pill px-5 py-2.5 transition-all"
                                    style={{
                                        color: 'var(--color-taupe)',
                                        border: '1px solid rgba(138, 158, 141, 0.25)',
                                        background: 'transparent',
                                        transitionDuration: 'var(--duration-med)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'var(--color-surface)'
                                        e.currentTarget.style.borderColor = 'var(--color-sage)'
                                        e.currentTarget.style.background = 'rgba(138, 158, 141, 0.1)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'var(--color-taupe)'
                                        e.currentTarget.style.borderColor = 'rgba(138, 158, 141, 0.25)'
                                        e.currentTarget.style.background = 'transparent'
                                    }}
                                >
                                    {city}
                                </Link>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 7: FOR PROVIDERS ═══ */}
            <section className="py-20 lg:py-28">
                <div className="container-content">
                    <RevealOnScroll>
                        <div className="text-center mb-16 mx-auto" style={{ maxWidth: '680px' }}>
                            <span
                                className="font-body uppercase font-medium block mb-3"
                                style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--color-sage)' }}
                            >
                                For Injectors & Clinics
                            </span>
                            <h2
                                className="font-display font-light mb-4"
                                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--color-espresso)' }}
                            >
                                Be the provider patients find when they&apos;re ready to book.
                            </h2>
                            <p className="font-body" style={{ fontSize: '16px', color: 'var(--color-stone)', lineHeight: 1.7 }}>
                                InjectorIndex profiles rank in Google search, AI assistants, and local results — so patients find you before they find your competitors.
                            </p>
                        </div>
                    </RevealOnScroll>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                        variants={cardGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {providerValueProps.map((prop) => (
                            <motion.div key={prop.title} variants={cardItem}>
                                <div
                                    className="p-8 rounded-lg transition-all"
                                    style={{ background: 'white', border: '1px solid var(--color-border)' }}
                                >
                                    <span className="text-2xl block mb-4">{prop.emoji}</span>
                                    <h3
                                        className="font-display font-medium mb-3"
                                        style={{ fontSize: '20px', color: 'var(--color-espresso)' }}
                                    >
                                        {prop.title}
                                    </h3>
                                    <p className="font-body" style={{ fontSize: '15px', color: 'var(--color-stone)', lineHeight: 1.7 }}>
                                        {prop.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <RevealOnScroll>
                        <div className="text-center">
                            <Link href="/claim">
                                <Button variant="secondary" size="lg">
                                    Claim Your Profile — It&apos;s Free to Start
                                </Button>
                            </Link>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            {/* ═══ QUIZ CTA ═══ */}
            <section className="container-content py-24">
                <QuizBanner />
            </section>

            {/* Scroll-triggered CTA */}
            <ScrollCTA variant="homepage" />
        </>
    )
}
