'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { Button } from '@/components/ui/Button'
import { PriceWidget } from '@/components/price-pool/PriceWidget'
import { PriceReportWidget } from '@/components/providers/PriceReportWidget'
import { DividerPhoto } from '@/components/redesign/DividerPhoto'

// Homepage — Catchafire-style redesign (Nov 6, 2026, branch
// va/redesign-catchafire-v4). Warm cream background, white cards, bold
// serif headlines, small-caps eyebrows, dark pill CTAs, in the site's
// own cream / serif / dark-brown / gold language.
//
// Photos are ambiance dividers only, never one per provider card, never
// repeated, each representative of its section. The testimonials section
// from the preview is NOT built here: its three quotes (Maya, Sophia,
// Priya) are sample copy, and sample copy is never presented as real
// patient words. The founder quote stays: it is John's own words.
//
// All numbers come from live props (app/page.tsx counts the providers
// table). Nothing is hardcoded.

const cities = [
    { name: 'New York', slug: 'ny/new-york' },
    { name: 'Los Angeles', slug: 'ca/los-angeles' },
    { name: 'Miami', slug: 'fl/miami' },
    { name: 'Chicago', slug: 'il/chicago' },
    { name: 'Portland', slug: 'or/portland' },
    { name: 'Seattle', slug: 'wa/seattle' },
    { name: 'Scottsdale', slug: 'az/scottsdale' },
    { name: 'Dallas', slug: 'tx/dallas' },
    { name: 'Austin', slug: 'tx/austin' },
    { name: 'Denver', slug: 'co/denver' },
    { name: 'Nashville', slug: 'tn/nashville' },
    { name: 'Atlanta', slug: 'ga/atlanta' },
    { name: 'San Diego', slug: 'ca/san-diego' },
    { name: 'Boston', slug: 'ma/boston' },
    { name: 'Houston', slug: 'tx/houston' },
    { name: 'Charlotte', slug: 'nc/charlotte' },
]

const howItWorks = [
    {
        step: 'Step 1',
        title: 'Find your provider',
        description: 'Search by city and check credentials in one place, before you fall for a pretty Instagram feed.',
    },
    {
        step: 'Step 2',
        title: 'Compare real prices',
        description: 'See what people actually paid, next to reviews and Clarity Scores, not just star ratings.',
    },
    {
        step: 'Step 3',
        title: 'Book with confidence',
        description: 'Choose a provider after checking credentials, pricing, and patient reviews side by side.',
    },
]

const treatments = [
    {
        title: 'Botox & Dysport',
        description: 'The classic line smoother, and the most reported treatment on the site.',
        link: '/find-providers?q=botox',
        linkLabel: 'See Botox prices',
    },
    {
        title: 'Lip Filler',
        description: 'Natural fullness, done well. Compare clinics by score and price.',
        link: '/find-providers?q=filler',
        linkLabel: 'See lip filler prices',
    },
    {
        title: 'Cheek & Jaw Filler',
        description: 'Structure and lift. See who does it best near you.',
        link: '/find-providers?q=cheek',
        linkLabel: 'See filler prices',
    },
    {
        title: 'Daxxify',
        description: 'The longer lasting wrinkle relaxer. Find clinics that offer it.',
        link: '/find-providers?q=daxxify',
        linkLabel: 'See Daxxify prices',
    },
    {
        title: 'Sculptra',
        description: 'Gradual volume that builds over weeks. Compare providers.',
        link: '/find-providers?q=sculptra',
        linkLabel: 'See Sculptra prices',
    },
    {
        title: 'Polynucleotides',
        description: 'Skin health from the inside out. See who offers it near you.',
        link: '/find-providers?q=polynucleotides',
        linkLabel: 'See polynucleotide prices',
    },
]

const providerValueProps = [
    {
        title: 'Your Listing Stays Free',
        description: 'Listing, corrections, claiming, photos, and your logo are free, and stay free. There are no paid plans right now.',
    },
    {
        title: 'Your Clarity Score™ Does the Selling',
        description: 'Patients trust independent scoring over paid ads. A strong Clarity Score™ tells them you earned your reputation, not bought it.',
    },
    {
        title: 'Optimized for Google & Local SEO',
        description: 'Your profile is schema-optimized so search engines understand exactly what you offer, where you are, and who you serve.',
    },
]

// Framer motion variants (below-fold grids only — the hero renders plain)
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

interface HomeClientProps {
    providersIndexed?: number;
    npiVerified?: number;
    citiesVerified?: number;
    heroCity?: string | null;
    heroRange?: string | null;
}

export default function HomeClient({
    providersIndexed = 0,
    npiVerified = 0,
    citiesVerified = 0,
    heroCity = null,
    heroRange = null
}: HomeClientProps = {}) {

    // Dynamic stats: only show numbers we actually have. A row of zeros
    // reads as a broken site, and a verification count we have not earned
    // reads as a false claim. Labels name exactly what was counted.
    const trustStats = [
        { value: providersIndexed, label: 'Providers Listed' },
        { value: npiVerified, label: 'NPI-Verified Providers' },
        { value: citiesVerified, label: 'Cities with NPI-Verified Providers' },
    ]
        .filter(s => s.value > 0)
        .map(s => ({ number: s.value.toLocaleString(), label: s.label }))

    // The price widget preselects the visitor's city when the geo header
    // resolved one that is in our list, a real location signal, never a guess.
    const heroCitySlug = heroCity
        ? cities.find((c) => c.name.toLowerCase() === heroCity.toLowerCase())?.slug ?? null
        : null

    return (
        <>
            {/* ═══ HERO ═══ */}
            <section className="relative" style={{ paddingTop: 'calc(var(--nav-height) + 48px)', paddingBottom: '40px' }}>
                <div className="container-content">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                        <div>
                            <p
                                className="text-[11px] font-bold uppercase tracking-[0.14em]"
                                style={{ color: 'var(--color-gold)' }}
                            >
                                Real prices, from real people
                            </p>
                            <h1
                                className="font-display font-bold mt-4 mb-5"
                                style={{ fontSize: 'clamp(44px, 5.6vw, 68px)', lineHeight: 1.08, letterSpacing: '-0.01em', color: 'var(--color-espresso)' }}
                            >
                                Know the <em style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>price</em> before you book.
                            </h1>
                            <p
                                className="mb-7"
                                style={{ fontSize: '19px', color: 'var(--color-stone)', maxWidth: '34rem', lineHeight: 1.6 }}
                            >
                                Most clinics don't post their prices. Patients report what they paid, and once a city has enough reports, we show the range so you know what's fair before you walk in.
                            </p>
                            <div className="flex items-center gap-5 flex-wrap">
                                <a
                                    href="#check-prices"
                                    className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-full font-bold text-[15px] text-white transition-all hover:-translate-y-0.5"
                                    style={{ background: 'var(--color-espresso)' }}
                                >
                                    Check treatment prices
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="font-bold text-[15px] underline underline-offset-4"
                                    style={{ color: 'var(--color-espresso)' }}
                                >
                                    See how it works
                                </a>
                            </div>
                        </div>
                        <div className="relative w-full overflow-hidden rounded-[16px] aspect-[4/3] lg:aspect-[4/4.4]">
                            <Image
                                src="/images/redesign/hero-glow.webp"
                                alt="Young woman with fresh, natural glowing skin in bright daylight"
                                fill
                                sizes="(max-width: 1024px) 100vw, 560px"
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PRICE CHECKER + REPORT YOUR PRICE ═══ */}
            <section id="check-prices" className="container-content scroll-mt-24">
                <PriceWidget cities={cities} defaultCitySlug={heroCitySlug} />
                <p className="text-[13px] mt-4" style={{ color: 'var(--color-stone)' }}>
                    Based on moderated patient reports. Featured spots are free. A featured spot never changes a provider's Clarity Score, and never changes the order of the unpaid results.
                </p>

                <div className="mt-6">
                    <PriceReportWidget />
                    <p className="text-[13px] mt-3" style={{ color: 'var(--color-stone)' }}>
                        Anonymous. Only combined ranges ever publish, never a single report.
                    </p>
                </div>

                {/* Stats strip: live counts only */}
                {trustStats.length > 0 && (
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-[16px] border mt-14 p-6 md:px-8"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                        {trustStats.map((stat) => (
                            <div key={stat.label}>
                                <b
                                    className="block font-display font-bold"
                                    style={{ fontSize: '32px', lineHeight: 1.1, color: 'var(--color-espresso)' }}
                                >
                                    {stat.number}
                                </b>
                                <span className="text-[13px]" style={{ color: 'var(--color-stone)' }}>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <div className="container-content">
                <DividerPhoto
                    src="/images/redesign/consultation-v4.webp"
                    alt="Young woman patient talking with a young woman practitioner in a bright consultation room"
                    caption="A real conversation first, then a plan."
                />
            </div>

            {/* ═══ HOW IT WORKS ═══ */}
            <section id="how-it-works" className="py-14 lg:py-20 scroll-mt-24">
                <div className="container-content">
                    <RevealOnScroll>
                        <div className="max-w-[640px] mb-9">
                            <p
                                className="text-[11px] font-bold uppercase tracking-[0.14em]"
                                style={{ color: 'var(--color-gold)' }}
                            >
                                How it works
                            </p>
                            <h2
                                className="font-display font-bold mt-3 mb-3"
                                style={{ fontSize: 'clamp(32px, 4vw, 44px)', lineHeight: 1.08, color: 'var(--color-espresso)' }}
                            >
                                Finding the right injector should not be a guessing game.
                            </h2>
                            <p className="text-[17px]" style={{ color: 'var(--color-stone)' }}>
                                Three steps, and you know more than the clinic&apos;s front desk expects you to.
                            </p>
                        </div>
                    </RevealOnScroll>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-5"
                        variants={cardGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {howItWorks.map((item) => (
                            <motion.div key={item.step} variants={cardItem}>
                                <div
                                    className="bg-white border rounded-[16px] p-6 h-full"
                                    style={{ borderColor: 'var(--color-border)' }}
                                >
                                    <p
                                        className="text-[12px] font-bold uppercase tracking-[0.1em]"
                                        style={{ color: 'var(--color-gold)' }}
                                    >
                                        {item.step}
                                    </p>
                                    <h3
                                        className="font-display font-bold my-2"
                                        style={{ fontSize: '25px', color: 'var(--color-espresso)' }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p className="text-[15px]" style={{ color: 'var(--color-stone)' }}>
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <div className="container-content">
                <DividerPhoto
                    src="/images/redesign/clinic-room.webp"
                    alt="Calm, bright aesthetic clinic treatment room"
                    caption="Quiet treatment rooms, ready for the next patient."
                />
            </div>

            {/* ═══ TREATMENTS ═══ */}
            <section className="py-14 lg:py-20">
                <div className="container-content">
                    <RevealOnScroll>
                        <div className="max-w-[640px] mb-9">
                            <p
                                className="text-[11px] font-bold uppercase tracking-[0.14em]"
                                style={{ color: 'var(--color-gold)' }}
                            >
                                Treatments
                            </p>
                            <h2
                                className="font-display font-bold mt-3 mb-3"
                                style={{ fontSize: 'clamp(32px, 4vw, 44px)', lineHeight: 1.08, color: 'var(--color-espresso)' }}
                            >
                                Explore treatments. Tap one to learn more.
                            </h2>
                            <p className="text-[17px]" style={{ color: 'var(--color-stone)' }}>
                                Clarity Scores for every treatment we track, and price ranges as patients report them.
                            </p>
                        </div>
                    </RevealOnScroll>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-5"
                        variants={cardGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {treatments.map((t) => (
                            <motion.div key={t.title} variants={cardItem}>
                                <div
                                    className="bg-white border rounded-[16px] p-6 h-full"
                                    style={{ borderColor: 'var(--color-border)' }}
                                >
                                    <h3
                                        className="font-display font-bold mb-1.5"
                                        style={{ fontSize: '24px', color: 'var(--color-espresso)' }}
                                    >
                                        {t.title}
                                    </h3>
                                    <p className="text-[15px] mb-3.5" style={{ color: 'var(--color-stone)' }}>
                                        {t.description}
                                    </p>
                                    <Link
                                        href={t.link}
                                        className="font-bold text-sm underline underline-offset-4"
                                        style={{ color: 'var(--color-espresso)' }}
                                    >
                                        {t.linkLabel}
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <div className="container-content">
                <DividerPhoto
                    src="/images/redesign/credentials-wall.webp"
                    alt="Framed certificates and diplomas on a clinic wall"
                    caption="The proof behind the score, framed on the wall."
                />
            </div>

            {/* ═══ CLARITY SCORE ═══ */}
            <section className="py-14 lg:py-20">
                <div className="container-content">
                    <div
                        className="rounded-[20px] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10"
                        style={{ background: 'var(--color-deep)', color: '#F5EFE6' }}
                    >
                        <div>
                            <p
                                className="text-[11px] font-bold uppercase tracking-[0.14em]"
                                style={{ color: 'var(--color-gold)' }}
                            >
                                The Clarity Score
                            </p>
                            <h2
                                className="font-display font-bold mt-3 mb-3.5 text-white"
                                style={{ fontSize: 'clamp(30px, 3.6vw, 42px)', lineHeight: 1.08 }}
                            >
                                One number that tells you what you can confirm before you book.
                            </h2>
                            <p className="text-[16px] max-w-[36rem]" style={{ color: 'rgba(245,239,230,.78)' }}>
                                The Clarity Score summarizes patient reviews, published pricing, and contact information. Booking links and quotes are worth zero points. NPI verification is shown separately and never adds points.
                            </p>
                            <p className="text-[16px] mt-3" style={{ color: 'rgba(245,239,230,.78)' }}>
                                No pay to play, no shortcuts. <Link href="/methodology" className="font-bold underline underline-offset-4 text-white">Read the full methodology</Link>
                            </p>
                        </div>
                        <div>
                            <div className="flex flex-col">
                                <div className="flex justify-between items-baseline gap-4 py-4 border-b" style={{ borderColor: 'rgba(245,239,230,.16)' }}>
                                    <b className="font-display font-semibold text-[22px] text-white">Patient reviews</b>
                                    <span className="text-sm text-right" style={{ color: 'rgba(245,239,230,.72)' }}>40 points</span>
                                </div>
                                <div className="flex justify-between items-baseline gap-4 py-4 border-b" style={{ borderColor: 'rgba(245,239,230,.16)' }}>
                                    <b className="font-display font-semibold text-[22px] text-white">Published pricing</b>
                                    <span className="text-sm text-right" style={{ color: 'rgba(245,239,230,.72)' }}>10 points</span>
                                </div>
                                <div className="flex justify-between items-baseline gap-4 py-4">
                                    <b className="font-display font-semibold text-[22px] text-white">Contact information</b>
                                    <span className="text-sm text-right" style={{ color: 'rgba(245,239,230,.72)' }}>7 points</span>
                                </div>
                            </div>
                            <p className="text-[13px] mt-3.5" style={{ color: 'rgba(245,239,230,.6)' }}>
                                Scores are rescaled to 100. A clinic with under 5 reviews shows as not enough data.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FOUNDER ═══ */}
            <section className="py-14 lg:py-20">
                <div className="container-content">
                    <div
                        className="rounded-[20px] border p-8 md:p-11 grid grid-cols-1 md:grid-cols-[88px_1fr] gap-7 items-center"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                        <div
                            className="w-[88px] h-[88px] rounded-full flex items-center justify-center font-display font-bold text-[30px] text-white"
                            style={{ background: 'var(--color-espresso)' }}
                            aria-hidden="true"
                        >
                            JL
                        </div>
                        <div>
                            <blockquote
                                className="font-display font-medium mb-4"
                                style={{ fontSize: 'clamp(22px, 2.6vw, 28px)', lineHeight: 1.35, color: 'var(--color-espresso)' }}
                            >
                                &ldquo;I built VerifiedAesthetics because I was tired of the guesswork. Patients deserve to know two things before they book: <em style={{ color: 'var(--color-gold)' }}>is the pricing real</em>, and <em style={{ color: 'var(--color-gold)' }}>will I look like myself</em>?&rdquo;
                            </blockquote>
                            <cite className="not-italic text-sm" style={{ color: 'var(--color-stone)' }}>
                                <b className="text-[15px]" style={{ color: 'var(--color-espresso)' }}>John</b> · Founder, VerifiedAesthetics
                            </cite>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ EXPLORE BY CITY ═══ */}
            <section className="py-14 lg:py-20">
                <div className="container-content">
                    <RevealOnScroll>
                        <div className="max-w-[640px] mb-9">
                            <p
                                className="text-[11px] font-bold uppercase tracking-[0.14em]"
                                style={{ color: 'var(--color-gold)' }}
                            >
                                Explore by city
                            </p>
                            <h2
                                className="font-display font-bold mt-3 mb-3"
                                style={{ fontSize: 'clamp(32px, 4vw, 44px)', lineHeight: 1.08, color: 'var(--color-espresso)' }}
                            >
                                Clarity Scores in every city, and price ranges as patients report them.
                            </h2>
                        </div>
                    </RevealOnScroll>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        variants={cardGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {cities.map((city) => (
                            <motion.div key={city.name} variants={cardItem}>
                                <Link
                                    href={`/injectors/${city.slug}`}
                                    className="block bg-white border rounded-[16px] p-5 transition-colors hover:border-[var(--color-gold)]"
                                    style={{ borderColor: 'var(--color-border)' }}
                                >
                                    <h3
                                        className="font-display font-bold mb-1"
                                        style={{ fontSize: '23px', color: 'var(--color-espresso)' }}
                                    >
                                        {city.name}
                                    </h3>
                                    <p className="text-sm" style={{ color: 'var(--color-stone)' }}>
                                        Browse providers in {city.name}
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══ FOR PROVIDERS ═══ */}
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
                                VerifiedAesthetics profiles rank in Google search, AI assistants, and local results, so patients find you before they find your competitors.
                            </p>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll>
                        <div
                            className="rounded-2xl px-8 py-10 md:px-12 mb-12 flex flex-col md:flex-row items-center gap-6 md:gap-10"
                            style={{ background: 'var(--color-espresso)' }}
                        >
                            <p
                                className="font-body text-center md:text-left flex-1"
                                style={{ fontSize: '18px', color: 'var(--color-linen)', lineHeight: 1.6 }}
                            >
                                Your next patient is comparing prices right now. Claim your listing, publish your real prices, and stand on your confirmed credentials.
                            </p>
                            <Link
                                href="/claim"
                                className="shrink-0 rounded-full font-body text-sm font-bold px-6 py-3.5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                style={{ background: 'var(--color-linen)', color: 'var(--color-espresso)' }}
                            >
                                Claim your listing - free
                            </Link>
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
                                    Claim Your Profile, It&apos;s Free to Start
                                </Button>
                            </Link>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

        </>
    )
}
