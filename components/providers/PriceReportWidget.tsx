'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

// Anonymous "What did you pay?" widget — price-guide phase 1.
//
// Crowdsourced pricing, "we the people": real prices from real people,
// so the market data is live instead of a yearly survey. Contributor-first
// copy: "add your price — you make the guide real."
//
// Two paths, both anonymous for the PRICE itself (no name, no contact):
//   quick    city + product + quantity + total. No clinic required.
//   detailed provider selected from search + the full field set.
//
// Guide opt-in (owner's rule: optional, never required): if the visitor
// checks "Send me the free pricing guide" and enters an email, the email
// is saved in guide_requests ONLY — never on the price report, never
// linked to it. The price stays anonymous even when the visitor opts in.
// Delivery (owner's decision, Oct 24): SEND the existing guide right
// away, and update it as more pricing lands.
//
// Measurement is the deliverable; collection without display is the rule.
// This widget saves reports for moderation and never shows them: no
// averages, no per-clinic prices from reports, and the copy below never
// promises a published price or a live ticker. Honest freshness, when
// numbers ever display (phase 4): they update as submissions land, each
// carrying its date (month/year only, never the exact day) and sample
// size — and never one person's report on its own.
//
// Measurement events (anonymous counts only, no identifiers):
//   view  — fired once when the widget appears on screen
//   start — fired once on the visitor's first interaction with it
// Submission counts come from price_reports rows, so phase 1 reports
// submissions per 1,000 views as (reports / views) x 1000.

type Category = 'toxin' | 'filler' | 'biostimulator'
type Path = 'quick' | 'detailed'

const TOXIN_PRODUCTS = ['Botox', 'Dysport', 'Daxxify', 'Xeomin'] as const
const INJECTOR_TITLES = ['MD', 'DO', 'NP', 'PA', 'RN', 'other'] as const

interface ClinicOption {
    id: string
    name: string
    city?: string | null
    state?: string | null
}

const inputClass =
    'w-full px-4 py-3 rounded-2xl border border-[#3D2B1F]/15 bg-white outline-none transition-all text-base text-[#3D2B1F] focus:ring-4 focus:ring-[#C9A96E]/20'
const labelClass = 'text-sm font-bold text-[#3D2B1F] uppercase tracking-wider'

function todayIso(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function PriceReportWidget({
    initialPath = 'quick',
    initialClinic = null,
    initialCity,
}: {
    initialPath?: Path
    initialClinic?: ClinicOption | null
    initialCity?: string
}) {
    // A prefilled clinic forces the detailed path; otherwise the caller
    // picks the path (quick by default).
    const [path, setPath] = useState<Path>(initialClinic ? 'detailed' : initialPath)

    // Quick path: city only, no clinic.
    const [city, setCity] = useState(initialCity ?? '')

    // Detailed path: clinic search + select.
    const [clinicQuery, setClinicQuery] = useState(
        initialClinic
            ? `${initialClinic.name}${initialClinic.city ? ` — ${initialClinic.city}` : ''}${initialClinic.state ? `, ${initialClinic.state}` : ''}`
            : ''
    )
    const [clinicOptions, setClinicOptions] = useState<ClinicOption[]>([])
    const [clinicSearching, setClinicSearching] = useState(false)
    const [clinic, setClinic] = useState<ClinicOption | null>(initialClinic)
    const [showClinicList, setShowClinicList] = useState(false)

    // Shared: product + quantity + total.
    const [category, setCategory] = useState<Category>('toxin')
    const [toxinProduct, setToxinProduct] = useState<string>('Botox')
    const [fillerProduct, setFillerProduct] = useState('')
    const [quantity, setQuantity] = useState('')
    const [totalPaid, setTotalPaid] = useState('')

    // Detailed path only: date, injector title, membership, disclosure.
    const [treatmentDate, setTreatmentDate] = useState('')
    const [injectorTitle, setInjectorTitle] = useState<string>('RN')
    const [membership, setMembership] = useState<'yes' | 'no'>('no')
    const [unitsDisclosed, setUnitsDisclosed] = useState(false)

    // Guide opt-in: optional, never required. Shown on both paths.
    const [guideOptIn, setGuideOptIn] = useState(false)
    const [guideEmail, setGuideEmail] = useState('')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [guideSent, setGuideSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const viewSentRef = useRef(false)
    const startSentRef = useRef(false)
    const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const sendEvent = (event: 'view' | 'start') => {
        // Fire-and-forget: a failed beacon must never bother the visitor.
        fetch('/api/price-report-events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event, path: window.location.pathname }),
        }).catch(() => {})
    }

    useEffect(() => {
        if (!viewSentRef.current) {
            viewSentRef.current = true
            sendEvent('view')
        }
        return () => {
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const markStarted = () => {
        if (!startSentRef.current) {
            startSentRef.current = true
            sendEvent('start')
        }
    }

    const searchClinics = (query: string) => {
        setClinicQuery(query)
        setClinic(null)
        if (query.trim().length < 2) {
            setClinicOptions([])
            setShowClinicList(false)
            return
        }
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
        setClinicSearching(true)
        searchTimerRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/providers?query=${encodeURIComponent(query.trim())}&limit=8`)
                const data = await res.json()
                const options: ClinicOption[] = (data.providers || []).map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    city: p.city,
                    state: p.state,
                }))
                setClinicOptions(options)
                setShowClinicList(true)
            } catch {
                setClinicOptions([])
            } finally {
                setClinicSearching(false)
            }
        }, 300)
    }

    const quantityLabel = category === 'toxin' ? 'Units' : category === 'filler' ? 'Syringes' : 'Vials'
    const productValue = category === 'toxin' ? toxinProduct : category === 'biostimulator' ? 'Sculptra' : fillerProduct.trim()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        markStarted()

        if (path === 'detailed' && !clinic) {
            setError('Please pick a clinic from the list.')
            return
        }
        if (path === 'quick' && !city.trim()) {
            setError('Please enter your city.')
            return
        }
        const quantityNum = Number(quantity)
        const totalNum = Number(totalPaid)
        if (!quantity || Number.isNaN(quantityNum) || quantityNum <= 0) {
            setError(`Please enter how many ${quantityLabel.toLowerCase()} you got.`)
            return
        }
        if (!totalPaid || Number.isNaN(totalNum) || totalNum <= 0) {
            setError('Please enter the total you paid.')
            return
        }
        if (!productValue) {
            setError('Please enter the product you got.')
            return
        }
        if (path === 'detailed') {
            if (!treatmentDate) {
                setError('Please pick the date of your treatment.')
                return
            }
            if (treatmentDate > todayIso()) {
                setError('Treatment date cannot be in the future.')
                return
            }
        }
        if (guideOptIn && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guideEmail.trim())) {
            setError('Please enter a valid email to get the guide.')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/price-reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submission_path: path,
                    provider_id: path === 'detailed' ? clinic?.id ?? null : null,
                    city: path === 'quick' ? city.trim() : null,
                    product_category: category,
                    product: category === 'toxin' ? toxinProduct.toLowerCase() : category === 'biostimulator' ? 'sculptra' : productValue,
                    quantity: quantityNum,
                    quantity_unit: category === 'toxin' ? 'units' : category === 'filler' ? 'syringes' : 'vials',
                    total_paid: totalNum,
                    treatment_date: path === 'detailed' ? treatmentDate : null,
                    injector_title: path === 'detailed' ? injectorTitle : null,
                    membership_flag: path === 'detailed' ? membership === 'yes' : null,
                    units_disclosed_flag: path === 'detailed' && category === 'toxin' ? unitsDisclosed : null,
                    guide_opt_in: guideOptIn,
                    guide_email: guideOptIn ? guideEmail.trim() : null,
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Could not save your report. Please try again.')
                return
            }
            setGuideSent(Boolean(data.guide_sent))
            setIsSuccess(true)
        } catch {
            setError('Could not save your report. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>Thanks — your price is in the pool.</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-[#3D2B1F]/70 leading-relaxed">
                        You just made the guide more real. Your report goes to a review queue first. We never show one
                        person&apos;s report on its own — any numbers we ever show will come from many reviewed reports
                        together, each carrying its date and how many reports it is based on.
                    </p>
                    {guideOptIn && (
                        <p className="text-[#3D2B1F]/70 leading-relaxed pt-3">
                            {guideSent
                                ? 'Check your inbox — your free pricing guide is on its way.'
                                : 'Your guide request is saved — we will send it shortly.'}
                        </p>
                    )}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle>What did you pay?</CardTitle>
                <p className="text-[#3D2B1F]/60 leading-relaxed pt-2">
                    Add your price — you make the guide real. Real prices from real people, not a yearly survey.
                    Anonymous, about 30 seconds. Your report is saved for review, and we never show one person&apos;s
                    report on its own.
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5" onFocus={markStarted}>
                    <div className="space-y-2">
                        <span className={labelClass}>How detailed?</span>
                        <div className="grid grid-cols-2 gap-2">
                            {(
                                [
                                    { value: 'quick', label: 'Quick — city only' },
                                    { value: 'detailed', label: 'Detailed — pick the clinic' },
                                ] as const
                            ).map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        markStarted()
                                        setPath(option.value)
                                    }}
                                    className={`py-3 px-2 rounded-2xl border text-sm font-bold transition-all ${
                                        path === option.value
                                            ? 'bg-[#3D2B1F] text-white border-[#3D2B1F]'
                                            : 'bg-white text-[#3D2B1F] border-[#3D2B1F]/15'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {path === 'quick' ? (
                        <div className="space-y-2">
                            <label className={labelClass} htmlFor="price-city">
                                City
                            </label>
                            <input
                                id="price-city"
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Portland"
                                maxLength={100}
                                className={inputClass}
                                autoComplete="off"
                            />
                            <p className="text-sm text-[#3D2B1F]/50">
                                No clinic needed — your city is enough to grow the pool.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2 relative">
                            <label className={labelClass} htmlFor="price-clinic">
                                Clinic
                            </label>
                            <input
                                id="price-clinic"
                                type="text"
                                value={clinic ? `${clinic.name}${clinic.city ? ` — ${clinic.city}` : ''}${clinic.state ? `, ${clinic.state}` : ''}` : clinicQuery}
                                onChange={(e) => searchClinics(e.target.value)}
                                onFocus={() => {
                                    markStarted()
                                    if (clinicOptions.length > 0) setShowClinicList(true)
                                }}
                                placeholder="Start typing the clinic name…"
                                className={inputClass}
                                autoComplete="off"
                            />
                            {clinicSearching && <p className="text-sm text-[#3D2B1F]/50">Searching…</p>}
                            {showClinicList && clinicOptions.length > 0 && (
                                <ul className="absolute z-10 w-full mt-1 bg-white border border-[#3D2B1F]/15 rounded-2xl shadow-lg overflow-hidden">
                                    {clinicOptions.map((option) => (
                                        <li key={option.id}>
                                            <button
                                                type="button"
                                                className="w-full text-left px-4 py-3 hover:bg-[#FAF8F5] text-[#3D2B1F]"
                                                onClick={() => {
                                                    setClinic(option)
                                                    setShowClinicList(false)
                                                }}
                                            >
                                                {option.name}
                                                {option.city && <span className="text-[#3D2B1F]/50"> — {option.city}</span>}
                                                {option.state && <span className="text-[#3D2B1F]/50">, {option.state}</span>}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {showClinicList && clinicQuery.trim().length >= 2 && !clinicSearching && clinicOptions.length === 0 && (
                                <p className="text-sm text-[#3D2B1F]/50">No clinic matched. Try another spelling, or use the quick path.</p>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <span className={labelClass}>What did you get?</span>
                        <div className="grid grid-cols-3 gap-2">
                            {(
                                [
                                    { value: 'toxin', label: 'Toxin' },
                                    { value: 'filler', label: 'Filler' },
                                    { value: 'biostimulator', label: 'Sculptra' },
                                ] as const
                            ).map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        markStarted()
                                        setCategory(option.value)
                                    }}
                                    className={`py-3 rounded-2xl border text-sm font-bold transition-all ${
                                        category === option.value
                                            ? 'bg-[#3D2B1F] text-white border-[#3D2B1F]'
                                            : 'bg-white text-[#3D2B1F] border-[#3D2B1F]/15'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {category === 'toxin' && (
                        <div className="space-y-2">
                            <label className={labelClass} htmlFor="price-product">
                                Product
                            </label>
                            <select
                                id="price-product"
                                value={toxinProduct}
                                onChange={(e) => setToxinProduct(e.target.value)}
                                className={inputClass}
                            >
                                {TOXIN_PRODUCTS.map((product) => (
                                    <option key={product} value={product}>
                                        {product}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {category === 'filler' && (
                        <div className="space-y-2">
                            <label className={labelClass} htmlFor="price-product">
                                Filler product
                            </label>
                            <input
                                id="price-product"
                                type="text"
                                value={fillerProduct}
                                onChange={(e) => setFillerProduct(e.target.value)}
                                placeholder="Juvederm, Restylane, RHA…"
                                maxLength={80}
                                className={inputClass}
                            />
                        </div>
                    )}

                    {category === 'biostimulator' && (
                        <p className="text-sm text-[#3D2B1F]/60 leading-relaxed">
                            Sculptra is listed on its own, never as a filler — it works differently and is priced per vial.
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelClass} htmlFor="price-quantity">
                                {quantityLabel}
                            </label>
                            <input
                                id="price-quantity"
                                type="number"
                                inputMode="decimal"
                                step="0.5"
                                min="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder={category === 'toxin' ? 'e.g. 30' : 'e.g. 1'}
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClass} htmlFor="price-total">
                                Total paid ($)
                            </label>
                            <input
                                id="price-total"
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                min="0"
                                value={totalPaid}
                                onChange={(e) => setTotalPaid(e.target.value)}
                                placeholder="e.g. 420"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {path === 'detailed' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className={labelClass} htmlFor="price-date">
                                        Date of treatment
                                    </label>
                                    <input
                                        id="price-date"
                                        type="date"
                                        max={todayIso()}
                                        value={treatmentDate}
                                        onChange={(e) => setTreatmentDate(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClass} htmlFor="price-injector">
                                        Injector title
                                    </label>
                                    <select
                                        id="price-injector"
                                        value={injectorTitle}
                                        onChange={(e) => setInjectorTitle(e.target.value)}
                                        className={inputClass}
                                    >
                                        {INJECTOR_TITLES.map((title) => (
                                            <option key={title} value={title}>
                                                {title === 'other' ? 'Other' : title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className={labelClass}>Membership or prepay?</span>
                                <div className="flex gap-2">
                                    {(['yes', 'no'] as const).map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => {
                                                markStarted()
                                                setMembership(option)
                                            }}
                                            className={`flex-1 py-3 rounded-2xl border text-sm font-bold transition-all ${
                                                membership === option
                                                    ? 'bg-[#3D2B1F] text-white border-[#3D2B1F]'
                                                    : 'bg-white text-[#3D2B1F] border-[#3D2B1F]/15'
                                            }`}
                                        >
                                            {option === 'yes' ? 'Yes' : 'No'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {category === 'toxin' && (
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={unitsDisclosed}
                                        onChange={(e) => setUnitsDisclosed(e.target.checked)}
                                        className="mt-1 h-5 w-5 accent-[#3D2B1F]"
                                    />
                                    <span className="text-[#3D2B1F]/80 leading-relaxed">
                                        Did the clinic tell you how many units you got?
                                    </span>
                                </label>
                            )}
                        </>
                    )}

                    {error && (
                        <p role="alert" className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                            {error}
                        </p>
                    )}

                    <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                        {isSubmitting ? 'Saving…' : 'Share what you paid'}
                    </Button>

                    <div className="space-y-2 pt-1">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={guideOptIn}
                                onChange={(e) => setGuideOptIn(e.target.checked)}
                                className="mt-1 h-5 w-5 accent-[#3D2B1F]"
                            />
                            <span className="text-[#3D2B1F]/80 leading-relaxed">
                                Send me the free pricing guide. Optional — only if you want it.
                            </span>
                        </label>
                        {guideOptIn && (
                            <>
                                <input
                                    type="email"
                                    value={guideEmail}
                                    onChange={(e) => setGuideEmail(e.target.value)}
                                    placeholder="Your email"
                                    maxLength={254}
                                    className={inputClass}
                                    autoComplete="email"
                                />
                                <p className="text-sm text-[#3D2B1F]/50 leading-relaxed">
                                    Your email is only used to send the guide. It is never linked to your price.
                                </p>
                            </>
                        )}
                    </div>
                    <p className="text-xs text-[#3D2B1F]/50 leading-relaxed text-center">
                        No name asked. Email only if you want the guide. No receipt upload. Your report goes to a review
                        queue first.
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}
