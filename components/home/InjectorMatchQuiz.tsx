'use client'

import { useState, useEffect } from 'react'
import { track } from '@/lib/analytics'
import { formatScore } from '@/lib/scoring'
import {
    ChevronRight,
    ArrowRight,
    Check,
    Sparkles,
    ShieldCheck,
    MapPin,
    User,
    Zap,
    Target,
    Activity,
    Search,
    Mail,
    ChevronLeft,
    ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NICHE } from '@/config/niche'
import Link from 'next/link'
import { getProvidersWithSearch } from '@/lib/actions/providers'

const STEPS = [
    {
        id: 'treatments',
        title: 'What are you looking for?',
        subtitle: 'Select all that apply to refine your match.',
        options: [
            { id: 'botox', label: 'Botox / Wrinkle Smoothing', icon: Zap },
            { id: 'lip-filler', label: 'Lip Filler / Volume', icon: Target },
            { id: 'facial-contouring', label: 'Facial Contouring (jawline, cheeks)', icon: Activity },
            { id: 'skin-quality', label: 'Skin Quality (texture, glow, tightening)', icon: Sparkles },
            { id: 'preventative', label: 'Preventative / "Baby Botox"', icon: ShieldCheck },
        ]
    },
    {
        id: 'priorities',
        title: 'What matters most to you?',
        subtitle: 'Rank your top priorities for your results.',
        options: [
            { id: 'natural', label: 'Natural-looking results (no "overdone" look)', icon: Sparkles },
            { id: 'price', label: 'Lowest price in my area', icon: Target },
            { id: 'credentials', label: 'Most experienced / highest credentials', icon: ShieldCheck },
            { id: 'innovation', label: 'Offers newest treatments (PNs, Daxxify)', icon: Zap },
        ]
    },
    {
        id: 'location',
        title: 'Where are you located?',
        subtitle: 'We only match you with providers in your metro area.',
    },
    {
        id: 'experience',
        title: 'What is your experience level?',
        subtitle: 'Helps us match you with the right clinician style.',
        options: [
            { id: 'new', label: 'First time — never had injectables' },
            { id: 'returning', label: 'I\'ve had Botox/filler before' },
            { id: 'regular', label: 'Regular patient — looking to switch providers' },
        ]
    }
]

export default function InjectorMatchQuiz() {
    const [stepIndex, setStepIndex] = useState(0)
    const [selectedTreatments, setSelectedTreatments] = useState<string[]>([])
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
    const [selectedCity, setSelectedCity] = useState('')
    const [experience, setExperience] = useState('')
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [matches, setMatches] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const currentStep = STEPS[stepIndex]

    const nextStep = () => {
        if (stepIndex < STEPS.length - 1) {
            const nextIdx = stepIndex + 1
            setStepIndex(nextIdx)
            // GA4: Track step progress
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'matcher_step', {
                    step: nextIdx + 1,
                    step_name: STEPS[nextIdx].id
                })
            }
        } else {
            handleFinalSubmit()
        }
    }

    const prevStep = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1)
        }
    }

    const toggleTreatment = (id: string) => {
        setSelectedTreatments(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    const togglePriority = (id: string) => {
        setSelectedPriorities(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        )
    }

    const handleFinalSubmit = async () => {
        setLoading(true)
        // GA4: Track start of submission
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'matcher_submit_start', {})
        }

        try {
            const cityObj = NICHE.cities.find(c => c.slug === selectedCity)
            const cityName = cityObj ? cityObj.name : ''
            const stateCode = cityObj ? cityObj.state : ''

            // Fetch real providers from the city
            const providers = await getProvidersWithSearch({
                city: cityName,
                state: stateCode,
                limit: 3,
                sort: 'priority'
            }) as any[]

            setMatches(providers.slice(0, 3))
            track('quiz_completed', { city: selectedCity, matches: providers.slice(0, 3).length })
            // Conversion event (Oct 2026): same completion, under the
            // name GA4 will mark as a key event. Legacy name kept above.
            track('quiz_complete', {})
            setIsSubmitted(true)

            // GA4: Track successful completion (Key Event)
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'matcher_complete', {
                    city: cityName,
                    matches_count: providers.length
                })
            }
        } catch (error) {
            console.error('Match finding failed:', error)
            setMatches([])
            setIsSubmitted(true)

            // GA4: Track error
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'matcher_error', { error: 'fetch_failed' })
            }
        } finally {
            setLoading(false)
        }
    }

    const [emailSubmitting, setEmailSubmitting] = useState(false)
    const [emailSuccess, setEmailSuccess] = useState(false)

    const handleEmailSubmit = async () => {
        if (!email.includes('@')) return;
        setEmailSubmitting(true)
        try {
            const { submitMatchEmailRequest } = await import('@/lib/actions/match')
            const cityObj = NICHE.cities.find(c => c.slug === selectedCity)
            const result = await submitMatchEmailRequest({
                email,
                city: cityObj?.name || selectedCity,
                treatments: selectedTreatments.map(t => STEPS[0].options?.find(o => o.id === t)?.label || t),
                matches
            })
            if (result.success) {
                track('quiz_email_submitted', { city: cityObj?.name || selectedCity })
                setEmailSuccess(true)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setEmailSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <section className="py-24 bg-[#FAF8F5]" id="match-results">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-xs font-black tracking-widest uppercase mb-6">
                            <Sparkles className="w-3.5 h-3.5" /> Your Personalized Matches
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-[#3D2B1F] mb-6">
                            Your Top 3 Clinicians in <span className="text-[#C9A96E]">{NICHE.cities.find(c => c.slug === selectedCity)?.name || 'Your City'}</span>
                        </h2>
                        <p className="text-[#3D2B1F]/70 mb-12 max-w-2xl mx-auto font-light">
                            Based on your goal for {selectedTreatments.map(t => STEPS[0].options?.find(o => o.id === t)?.label).join(', ')} and your priority for natural results.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            {matches.length > 0 ? (
                                matches.map((provider, i) => (
                                    <div key={provider.id || i} className="bg-[#3D2B1F]/5 border border-white/[0.08] rounded-[2.5rem] p-6 text-left hover:bg-[#3D2B1F]/5 transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4">
                                            <div className="bg-[#C9A96E] text-white text-[10px] font-black px-2 py-1 rounded-lg">
                                                Match #{i + 1}
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <div className="w-16 h-16 rounded-2xl bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 flex items-center justify-center text-[#C9A96E] mb-4">
                                                <User className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-xl font-bold text-[#3D2B1F] mb-1 leading-tight">{provider.name}</h3>
                                            <p className="text-xs text-[#3D2B1F]/60 font-medium uppercase tracking-wider">{provider.city}, {provider.state}</p>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between items-center bg-black/20 rounded-xl p-3 border border-[#3D2B1F]/10">
                                                <span className="text-[10px] font-black text-[#3D2B1F]/60 uppercase tracking-widest">Clarity Score™</span>
                                                <span className="text-lg font-display font-bold text-[#C9A96E]">{formatScore(provider.score_total)}</span>
                                            </div>
                                            <div className="flex justify-between items-center px-3">
                                                <span className="text-[10px] font-bold text-[#3D2B1F]/50 uppercase">Botox Price</span>
                                                <span className="text-sm font-bold text-[#3D2B1F]">${provider.price_per_unit || '—'}</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/provider/${provider.slug}`}
                                            className="block"
                                            onClick={() => {
                                                if (typeof window.gtag === 'function') {
                                                    window.gtag('event', 'matcher_result_click', {
                                                        provider_name: provider.name,
                                                        provider_id: provider.id,
                                                        city: provider.city,
                                                        tier: provider.listing_tier || 'free'
                                                    })
                                                }
                                            }}
                                        >
                                            <Button className="w-full bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 hover:bg-[#C9A96E] hover:text-white hover:border-[#C9A96E] transition-all font-black uppercase tracking-widest text-[10px] py-4 rounded-xl">
                                                View Profile
                                            </Button>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 py-16 text-center border border-dashed border-[#3D2B1F]/10 rounded-[2.5rem] bg-white/[0.01]">
                                    <div className="text-4xl mb-6">🤷‍♀️</div>
                                    <h3 className="text-xl font-bold text-[#3D2B1F] mb-2">No Clinicians Found in "{NICHE.cities.find(c => c.slug === selectedCity)?.name}"</h3>
                                    <p className="text-[#3D2B1F]/60 max-w-md mx-auto mb-8 font-light">
                                        Try selecting a nearby metro area or broadening your search criteria. You can also view our full directory for all top-rated injectors.
                                    </p>
                                    <Link href="/find-providers">
                                        <Button className="bg-[#C9A96E] text-white font-black uppercase tracking-widest px-8">
                                            Browse All Top Injectors
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Soft Email Capture */}
                        <div className="bg-gradient-to-br from-[#131f30] to-[#0d1720] border border-[#C9A96E]/20 rounded-[3rem] p-10 md:p-14 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A96E] opacity-[0.03] blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                            <div className="max-w-2xl mx-auto">
                                <h3 className="text-3xl font-display font-bold text-[#3D2B1F] mb-4">Want the Full Comparison?</h3>
                                <p className="text-[#3D2B1F]/70 mb-8 font-light">
                                    Get the complete provider breakdown for {NICHE.cities.find(c => c.slug === selectedCity)?.name || 'your city'} including pricing ranges, Clarity Score™ details, and matching insights.
                                </p>

                                {emailSuccess ? (
                                    <div className="bg-[#8A9E8D]/10 border border-[#8A9E8D]/20 text-[#8A9E8D] p-6 rounded-2xl font-bold flex items-center justify-center gap-3">
                                        <Check className="w-5 h-5" />
                                        Report sent! Check your inbox.
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col md:flex-row gap-3">
                                            <div className="flex-1 relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D2B1F]/60" />
                                                <input
                                                    type="email"
                                                    placeholder="Enter your email address"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full h-14 pl-11 pr-6 bg-black/40 border border-[#3D2B1F]/10 rounded-2xl text-[#3D2B1F] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 transition-all font-light"
                                                    disabled={emailSubmitting}
                                                />
                                            </div>
                                            <Button
                                                onClick={handleEmailSubmit}
                                                disabled={emailSubmitting || !email.includes('@')}
                                                className="h-14 px-8 bg-[#C9A96E] hover:bg-[#B5955B] text-white font-black uppercase tracking-widest shadow-xl shadow-[#C9A96E]/10 rounded-2xl transition-all disabled:opacity-50"
                                            >
                                                {emailSubmitting ? 'Sending...' : 'Send My Report'}
                                            </Button>
                                        </div>
                                        <p className="text-[10px] text-[#3D2B1F]/50 mt-4 uppercase tracking-[0.2em]">We'll never spam you. Unsubscribe anytime.</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-24 bg-[#FAF8F5] border-t border-[#3D2B1F]/10" id="match-quiz">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-xs font-black tracking-widest uppercase mb-6">
                            <Zap className="w-3.5 h-3.5" /> 60-Second Matching
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-[#3D2B1F] mb-4">
                            Find Your Perfect <span className="text-[#C9A96E]">Clinician</span>
                        </h2>
                        <p className="text-[#3D2B1F]/70 font-light text-lg">
                            Answer 4 quick questions. Get matched with top-rated providers in your city.
                        </p>
                    </div>

                    {/* Quiz UI */}
                    <div className="bg-white/[0.01] border border-[#3D2B1F]/10 rounded-[3rem] p-8 md:p-14 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#3D2B1F]/5">
                            <div
                                className="h-full bg-[#C9A96E] transition-all duration-500"
                                style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
                            />
                        </div>

                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black text-[#3D2B1F]/50 uppercase tracking-widest">Question {stepIndex + 1} of {STEPS.length}</span>
                                {stepIndex > 0 && (
                                    <button onClick={prevStep} className="text-[#3D2B1F]/60 hover:text-[#3D2B1F] flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors">
                                        <ChevronLeft className="w-3 h-3" /> Back
                                    </button>
                                )}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-display font-bold text-[#3D2B1F] mb-2">{currentStep.title}</h3>
                            <p className="text-[#3D2B1F]/60 font-light">{currentStep.subtitle}</p>
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            {currentStep.id === 'location' ? (
                                <div className="col-span-2 group">
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A96E]" />
                                        <select
                                            value={selectedCity}
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                            className="w-full h-16 pl-12 pr-6 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-2xl text-[#3D2B1F] font-bold text-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 hover:bg-[#3D2B1F]/5 transition-all"
                                        >
                                            <option value="" disabled className="bg-[#FAF8F5]">Select your city...</option>
                                            {NICHE.cities.map((c: any) => (
                                                <option key={c.slug} value={c.slug} className="bg-[#FAF8F5]">{c.name}, {c.state}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3D2B1F]/60 pointer-events-none" />
                                    </div>
                                </div>
                            ) : currentStep.id === 'experience' ? (
                                currentStep.options?.map((opt: any) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setExperience(opt.id)}
                                        className={`p-6 rounded-2xl border text-left transition-all ${experience === opt.id
                                            ? 'bg-[#C9A96E]/10 border-[#C9A96E] ring-1 ring-[#C9A96E]'
                                            : 'bg-[#3D2B1F]/5 border-[#3D2B1F]/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`font-bold ${experience === opt.id ? 'text-[#C9A96E]' : 'text-[#3D2B1F]'}`}>{opt.label}</span>
                                            {experience === opt.id && <Check className="w-4 h-4 text-[#C9A96E]" />}
                                        </div>
                                    </button>
                                ))
                            ) : currentStep.id === 'treatments' ? (
                                currentStep.options?.map((opt: any) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => toggleTreatment(opt.id)}
                                        className={`p-6 rounded-2xl border text-left transition-all group/opt ${selectedTreatments.includes(opt.id)
                                            ? 'bg-[#C9A96E]/10 border-[#C9A96E] ring-1 ring-[#C9A96E]'
                                            : 'bg-[#3D2B1F]/5 border-[#3D2B1F]/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedTreatments.includes(opt.id) ? 'bg-[#C9A96E] text-white' : 'bg-[#3D2B1F]/5 text-[#3D2B1F]/60 group-hover/opt:text-[#3D2B1F]'
                                                }`}>
                                                {opt.icon && <opt.icon className="w-5 h-5" />}
                                            </div>
                                            <span className={`font-bold transition-colors ${selectedTreatments.includes(opt.id) ? 'text-[#3D2B1F]' : 'text-[#3D2B1F]/70 group-hover/opt:text-[#3D2B1F]'}`}>
                                                {opt.label}
                                            </span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                currentStep.options?.map((opt: any) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => togglePriority(opt.id)}
                                        className={`p-6 rounded-2xl border text-left transition-all group/opt ${selectedPriorities.includes(opt.id)
                                            ? 'bg-[#C9A96E]/10 border-[#C9A96E] ring-1 ring-[#C9A96E]'
                                            : 'bg-[#3D2B1F]/5 border-[#3D2B1F]/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedPriorities.includes(opt.id) ? 'bg-[#C9A96E] text-white' : 'bg-[#3D2B1F]/5 text-[#3D2B1F]/60 group-hover/opt:text-[#3D2B1F]'
                                                }`}>
                                                {opt.icon && <opt.icon className="w-5 h-5" />}
                                            </div>
                                            <span className={`font-bold transition-colors ${selectedPriorities.includes(opt.id) ? 'text-[#3D2B1F]' : 'text-[#3D2B1F]/70 group-hover/opt:text-[#3D2B1F]'}`}>
                                                {opt.label}
                                            </span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Footer / CTA */}
                        <div className="flex justify-between items-center pt-8 border-t border-[#3D2B1F]/10">
                            <p className="text-[10px] text-[#3D2B1F]/50 uppercase tracking-widest font-black flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3 text-[#8A9E8D]" /> Secure & Anonymous
                            </p>
                            <Button
                                onClick={nextStep}
                                disabled={
                                    loading ||
                                    (currentStep.id === 'treatments' && selectedTreatments.length === 0) ||
                                    (currentStep.id === 'priorities' && selectedPriorities.length === 0) ||
                                    (currentStep.id === 'location' && !selectedCity) ||
                                    (currentStep.id === 'experience' && !experience)
                                }
                                className="bg-[#C9A96E] hover:bg-[#B5955B] text-white font-black uppercase tracking-widest h-14 px-10 rounded-xl shadow-xl shadow-[#C9A96E]/10 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Matching...' : stepIndex === STEPS.length - 1 ? 'See My Matches' : 'Next Question'}
                                {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                            </Button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-[10px] text-gray-700 uppercase tracking-widest font-black">
                        No credit card required • No personal info shared • Independent matching
                    </p>
                </div>
            </div>
        </section>
    )
}


