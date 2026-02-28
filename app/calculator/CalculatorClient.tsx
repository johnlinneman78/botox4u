'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import Link from 'next/link'
import { Info, HelpCircle, Check, ArrowRight, ShieldCheck } from 'lucide-react'
import { PricingMethodology } from '@/components/tools/Methodology'
import { NICHE } from '@/config/niche'

// --- Types ---
type Tier = 'budget' | 'mid' | 'premium'

type PricingTier = {
    budget: number
    mid: number
    premium: number
}

type CityPricing = {
    pricing: Record<string, PricingTier>
    tier: 'high' | 'mid' | 'low'
    providerCount: number
    benchmarkDelta: number // % vs national median (+ means more expensive)
}

type TreatmentArea = {
    id: string
    label: string
    units: number
}

// --- Constants ---
const TREATMENT_AREAS: TreatmentArea[] = NICHE.calculator.treatmentAreas.map(area => ({
    id: area.id,
    label: area.label,
    units: area.defaultUnits
}));

const PRICING_DATA: Record<string, CityPricing> = {
    'new-york-ny': {
        pricing: {
            botox: { budget: 14, mid: 18, premium: 24 },
            dysport: { budget: 5, mid: 7, premium: 9 },
            xeomin: { budget: 11, mid: 14, premium: 18 }
        },
        tier: 'high',
        providerCount: 142,
        benchmarkDelta: 28
    },
    'los-angeles-ca': {
        pricing: {
            botox: { budget: 13, mid: 16, premium: 22 },
            dysport: { budget: 4.5, mid: 6, premium: 8 },
            xeomin: { budget: 10, mid: 13, premium: 17 }
        },
        tier: 'high',
        providerCount: 189,
        benchmarkDelta: 22
    },
    'miami-fl': {
        pricing: {
            botox: { budget: 12, mid: 15, premium: 19 },
            dysport: { budget: 4, mid: 5.5, premium: 7.5 },
            xeomin: { budget: 9.5, mid: 12, premium: 16 }
        },
        tier: 'mid',
        providerCount: 94,
        benchmarkDelta: 12
    },
    'chicago-il': {
        pricing: {
            botox: { budget: 13, mid: 16, premium: 20 },
            dysport: { budget: 4.5, mid: 6, premium: 8 },
            xeomin: { budget: 10, mid: 13, premium: 17 }
        },
        tier: 'mid',
        providerCount: 76,
        benchmarkDelta: 15
    },
    'scottsdale-az': {
        pricing: {
            botox: { budget: 11, mid: 13, premium: 17 },
            dysport: { budget: 4, mid: 5, premium: 7 },
            xeomin: { budget: 9, mid: 11, premium: 14 }
        },
        tier: 'mid',
        providerCount: 62,
        benchmarkDelta: 8
    },
    'dallas-tx': {
        pricing: {
            botox: { budget: 11, mid: 14, premium: 18 },
            dysport: { budget: 4, mid: 5.5, premium: 7 },
            xeomin: { budget: 9.5, mid: 12, premium: 15 }
        },
        tier: 'mid',
        providerCount: 88,
        benchmarkDelta: 5
    },
    'austin-tx': {
        pricing: {
            botox: { budget: 12, mid: 14, premium: 19 },
            dysport: { budget: 4.5, mid: 5.5, premium: 7.5 },
            xeomin: { budget: 10, mid: 12, premium: 16 }
        },
        tier: 'mid',
        providerCount: 54,
        benchmarkDelta: 10
    },
    'houston-tx': {
        pricing: {
            botox: { budget: 11, mid: 13.5, premium: 17 },
            dysport: { budget: 4, mid: 5, premium: 6.5 },
            xeomin: { budget: 9, mid: 11, premium: 14 }
        },
        tier: 'low',
        providerCount: 71,
        benchmarkDelta: -2
    },
    'phoenix-az': {
        pricing: {
            botox: { budget: 10.5, mid: 13, premium: 16 },
            dysport: { budget: 3.5, mid: 5, premium: 6.5 },
            xeomin: { budget: 8.5, mid: 11, premium: 13.5 }
        },
        tier: 'low',
        providerCount: 48,
        benchmarkDelta: -5
    },
    'denver-co': {
        pricing: {
            botox: { budget: 12, mid: 14.5, premium: 18 },
            dysport: { budget: 4.5, mid: 5.5, premium: 7 },
            xeomin: { budget: 10, mid: 12.5, premium: 15 }
        },
        tier: 'mid',
        providerCount: 39,
        benchmarkDelta: 4
    },
    'seattle-wa': {
        pricing: {
            botox: { budget: 13, mid: 16, premium: 20 },
            dysport: { budget: 5, mid: 6.5, premium: 8 },
            xeomin: { budget: 11, mid: 14, premium: 17 }
        },
        tier: 'high',
        providerCount: 52,
        benchmarkDelta: 18
    },
    'san-francisco-ca': {
        pricing: {
            botox: { budget: 15, mid: 19, premium: 26 },
            dysport: { budget: 5.5, mid: 7.5, premium: 10 },
            xeomin: { budget: 12, mid: 15, premium: 19 }
        },
        tier: 'high',
        providerCount: 85,
        benchmarkDelta: 35
    },
    'atlanta-ga': {
        pricing: {
            botox: { budget: 11.5, mid: 14, premium: 17.5 },
            dysport: { budget: 4, mid: 5.5, premium: 7 },
            xeomin: { budget: 9.5, mid: 12, premium: 15 }
        },
        tier: 'mid',
        providerCount: 67,
        benchmarkDelta: 6
    },
    'boston-ma': {
        pricing: {
            botox: { budget: 14, mid: 17, premium: 22 },
            dysport: { budget: 5, mid: 6.5, premium: 8.5 },
            xeomin: { budget: 11, mid: 14, premium: 18 }
        },
        tier: 'high',
        providerCount: 58,
        benchmarkDelta: 24
    },
    'las-vegas-nv': {
        pricing: {
            botox: { budget: 10, mid: 13, premium: 16.5 },
            dysport: { budget: 3.5, mid: 5, premium: 6.5 },
            xeomin: { budget: 8.5, mid: 11, premium: 14 }
        },
        tier: 'low',
        providerCount: 73,
        benchmarkDelta: -8
    },
    'philadelphia-pa': {
        pricing: {
            botox: { budget: 12, mid: 15, premium: 18 },
            dysport: { budget: 4.5, mid: 5.5, premium: 7 },
            xeomin: { budget: 10, mid: 12.5, premium: 15.5 }
        },
        tier: 'mid',
        providerCount: 45,
        benchmarkDelta: 7
    },
    'san-diego-ca': {
        pricing: {
            botox: { budget: 12.5, mid: 15.5, premium: 19 },
            dysport: { budget: 4.5, mid: 6, premium: 7.5 },
            xeomin: { budget: 10, mid: 13, premium: 16 }
        },
        tier: 'high',
        providerCount: 61,
        benchmarkDelta: 14
    },
    'nashville-tn': {
        pricing: {
            botox: { budget: 11.5, mid: 14, premium: 17 },
            dysport: { budget: 4, mid: 5.5, premium: 7 },
            xeomin: { budget: 9.5, mid: 12, premium: 15 }
        },
        tier: 'mid',
        providerCount: 36,
        benchmarkDelta: 3
    },
    'boise-id': {
        pricing: {
            botox: { budget: 9.5, mid: 12, premium: 15 },
            dysport: { budget: 3.5, mid: 4.5, premium: 6 },
            xeomin: { budget: 8, mid: 10, premium: 13 }
        },
        tier: 'low',
        providerCount: 22,
        benchmarkDelta: -12
    },
    'orlando-fl': {
        pricing: {
            botox: { budget: 11, mid: 13.5, premium: 16.5 },
            dysport: { budget: 4, mid: 5, premium: 6.5 },
            xeomin: { budget: 9, mid: 11.5, premium: 14.5 }
        },
        tier: 'low',
        providerCount: 41,
        benchmarkDelta: -3
    }
}

const CITY_OPTIONS = Object.keys(PRICING_DATA).map(slug => ({
    value: slug,
    label: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    tier: PRICING_DATA[slug].tier
})).sort((a, b) => a.label.localeCompare(b.label))

export default function CalculatorClient() {
    // --- State ---
    const initialCity = Object.keys(PRICING_DATA)[0]
    const [city, setCity] = useState<string>(NICHE.cities[0]?.slug || 'new-york-ny')
    const [treatmentType, setTreatmentType] = useState<string>(NICHE.calculator.variables[0]?.id || 'botox')
    const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set(NICHE.calculator.treatmentAreas.slice(0, 3).map(a => a.id)))
    const [tierValue, setTierValue] = useState<number[]>([50]) // 0-100 slider

    // --- Derived Values ---
    const cityData = PRICING_DATA[city] || PRICING_DATA['new-york']
    const totalUnits = Array.from(selectedAreas).reduce((sum, areaId) => {
        const area = TREATMENT_AREAS.find(a => a.id === areaId)
        return sum + (area?.units || 0)
    }, 0)

    // Determine Tier Category from Slider (0-33: Budget, 34-66: Mid, 67-100: Premium)
    const tierCategory: Tier = tierValue[0] <= 33 ? 'budget' : tierValue[0] <= 66 ? 'mid' : 'premium'

    // Get price per unit based on city + toxin + calculated tier
    const pricing = PRICING_DATA[city]?.pricing[treatmentType] || PRICING_DATA['new-york'].pricing['botox']
    const unitPrice = pricing[tierCategory]

    // Calculate Range (Headline)
    const calculatedTotal = totalUnits * unitPrice
    const rangeLow = Math.round(calculatedTotal * 0.9)
    const rangeHigh = Math.round(calculatedTotal * 1.1)

    // Benchmark Delta Text
    const deltaText = (cityData.benchmarkDelta || 0) > 0
        ? `${cityData.benchmarkDelta}% higher`
        : `${Math.abs(cityData.benchmarkDelta || 0)}% lower`

    // Gradient Position (for visual bar)
    const markerPosition = tierValue[0]

    // --- Handlers ---
    const toggleArea = (id: string) => {
        const next = new Set(selectedAreas)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setSelectedAreas(next)
    }

    return (
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Panel: Inputs */}
            <div className="lg:col-span-5 space-y-8">

                {/* 1. Location */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white/[0.03] text-[#d4af37] flex items-center justify-center text-xs border border-white/[0.06]">1</span>
                        Your Location
                    </label>
                    <div className="relative">
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-4 pr-12 bg-white/[0.03] border border-white/[0.06] rounded-xl text-lg font-medium text-white focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37]/30 outline-none appearance-none cursor-pointer hover:border-white/10 transition-colors z-10 relative"
                        >
                            {CITY_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label} {opt.tier === 'high' ? '($$$)' : opt.tier === 'low' ? '($)' : ''}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 z-20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-5 h-5"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                </div>

                {/* 2. Neurotoxin */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white/[0.03] text-[#d4af37] flex items-center justify-center text-xs border border-white/[0.06]">2</span>
                        Treatment Type
                    </label>
                    <div className="grid grid-cols-3 gap-2 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                        {NICHE.calculator.variables.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => setTreatmentType(v.id)}
                                className={`py-2.5 text-sm font-bold rounded-lg transition-all ${treatmentType === v.id
                                    ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20'
                                    : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                {v.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Treatment Areas */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white/[0.03] text-[#d4af37] flex items-center justify-center text-xs border border-white/[0.06]">3</span>
                        Target Areas
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                        {TREATMENT_AREAS.map(area => (
                            <div
                                key={area.id}
                                onClick={() => toggleArea(area.id)}
                                className={`group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedAreas.has(area.id)
                                    ? 'bg-[#d4af37]/5 border-[#d4af37]/30'
                                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedAreas.has(area.id) ? 'bg-[#d4af37] border-[#d4af37]' : 'border-gray-600 bg-white/[0.03]'
                                        }`}>
                                        {selectedAreas.has(area.id) && <Check className="w-3.5 h-3.5 text-[#0d1420]" />}
                                    </div>
                                    <span className={`font-medium ${selectedAreas.has(area.id) ? 'text-white' : 'text-gray-500'}`}>
                                        {area.label}
                                    </span>
                                </div>
                                <Badge variant="outline" className={`bg-white/[0.03] font-mono text-xs ${selectedAreas.has(area.id) ? 'text-[#d4af37] border-[#d4af37]/20' : 'text-gray-600 border-white/[0.06]'
                                    }`}>
                                    {area.units}u
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Provider Tier */}
                <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-white/[0.03] text-[#d4af37] flex items-center justify-center text-xs border border-white/[0.06]">4</span>
                            Provider Level
                        </label>
                        <div className="group relative cursor-help">
                            <HelpCircle className="w-4 h-4 text-gray-300 hover:text-gray-500 transition-colors" />
                            <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                Tier includes experience, credentials, and location overhead. Budget clinics often use nurse injectors; Premium often feature board-certified MDs.
                            </div>
                        </div>
                    </div>

                    <div className="px-2">
                        <Slider
                            value={tierValue}
                            onValueChange={setTierValue}
                            max={100}
                            step={1}
                            className="py-4"
                        />
                        <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                            <div className="flex flex-col items-start gap-1">
                                <span className={tierCategory === 'budget' ? 'text-emerald-400' : ''}>Budget ($)</span>
                                <span className="opacity-50 font-mono italic">Standard Audit</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className={tierCategory === 'mid' ? 'text-yellow-500' : ''}>Institutional ($$)</span>
                                <span className="opacity-50 font-mono italic">Verified Clinic</span>
                            </div>
                            <div className="flex flex-col items-end gap-1 text-right">
                                <span className={tierCategory === 'premium' ? 'text-[#d4af37]' : ''}>Artisan Specialist ($$$)</span>
                                <span className="opacity-50 font-mono italic">Elite Audit Pass</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Output */}
            <div className="lg:col-span-7">
                <div className="sticky top-24 space-y-6">
                    <Card className="border border-white/[0.06] shadow-2xl shadow-black/20 overflow-hidden bg-[#101827] ring-0">
                        <div className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 w-full relative">
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10 transition-all duration-300 ease-out transform -translate-x-1/2"
                                style={{ left: `${markerPosition}%` }}
                            />
                            <div
                                className="absolute -top-1 w-3 h-4 bg-primary rounded-b-full transform -translate-x-1/2 transition-all duration-300 ease-out"
                                style={{ left: `${markerPosition}%` }}
                            />
                        </div>

                        <CardContent className="p-8 lg:p-10 space-y-8">
                            {/* Headline */}
                            <div className="text-center space-y-2">
                                <p className="text-gray-600 font-medium text-sm tracking-wide uppercase">Estimated Total Cost</p>
                                <div className="text-5xl lg:text-7xl font-display font-bold text-white tracking-tight tabular-nums">
                                    ${rangeLow} – ${rangeHigh}
                                </div>
                                <div className="flex items-center justify-center gap-3 pt-2">
                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                        Market Data
                                    </Badge>
                                    <span className="text-sm text-gray-400 font-medium">
                                        Based on {cityData.providerCount} {CITY_OPTIONS.find(c => c.value === city)?.label} Providers
                                    </span>
                                </div>
                            </div>

                            {/* Conversion Hook: Audit */}
                            <div className="bg-[#d4af37]/10 rounded-2xl p-6 border border-[#d4af37]/20 flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1">
                                    <h4 className="text-white font-bold mb-1">Audit Your Local Clinics</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">
                                        We'll cross-reference your quote against {cityData.providerCount} verified providers in {CITY_OPTIONS.find(c => c.value === city)?.label}.
                                    </p>
                                </div>
                                <Link href="/audit" className="w-full md:w-auto">
                                    <Button size="sm" className="w-full bg-white text-[#0d1420] hover:bg-white/90 font-black rounded-lg text-[10px] uppercase tracking-wider h-10 px-6">
                                        Start Audit Free
                                    </Button>
                                </Link>
                            </div>

                            {/* Breakdown Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] rounded-2xl p-6 border border-white/[0.06]">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-600 uppercase">Unit Breakdown</p>
                                    <p className="text-2xl font-bold text-white tabular-nums">{totalUnits} <span className="text-base font-normal text-gray-500">units</span></p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {Array.from(selectedAreas).map(id => (
                                            <span key={id} className="text-[10px] bg-white/[0.03] border border-white/[0.06] px-1.5 py-0.5 rounded text-gray-500">
                                                {TREATMENT_AREAS.find(a => a.id === id)?.label}
                                            </span>
                                        ))}
                                        {selectedAreas.size === 0 && <span className="text-xs text-gray-400 italic">Select areas to see units</span>}
                                    </div>
                                </div>
                                <div className="space-y-1 md:text-right">
                                    <p className="text-xs font-bold text-gray-600 uppercase">Est. Price Per {NICHE.priceUnit.split(' ').slice(-1)}</p>
                                    <p className="text-2xl font-bold text-white tabular-nums">${unitPrice} <span className="text-base font-normal text-gray-500">/ {NICHE.priceUnit.split(' ').slice(-1)}</span></p>
                                    <p className="text-xs text-gray-400">
                                        Market Avg: ${pricing.mid}
                                    </p>
                                </div>
                            </div>

                            {/* Benchmark Context */}
                            <div className="bg-[#d4af37]/5 rounded-xl p-4 flex items-start gap-3 border border-[#d4af37]/10">
                                <Info className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-white font-medium">
                                        Market Insight
                                    </p>
                                    <p className="text-sm text-gray-400 leading-relaxed mt-1">
                                        Providers in <span className="font-semibold text-white">{CITY_OPTIONS.find(c => c.value === city)?.label}</span> average <span className={cityData.benchmarkDelta > 0 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>{deltaText}</span> than the national median.
                                        {tierCategory === 'budget' && " These clinics typically focus on efficiency while maintaining high clinical safety standards."}
                                        {tierCategory === 'mid' && " Institutional clinics balance volume and quality, generally falling into our primary verified range."}
                                        {tierCategory === 'premium' && " Premium Artisan Specialists pass our most rigorous multi-factor clinical audits for natural results."}
                                    </p>
                                </div>
                            </div>

                            {/* CTA */}
                            <Link href={`/${NICHE.baseSlug}/${city}`} className="block">
                                <Button className="w-full text-lg py-7 rounded-xl shadow-xl shadow-[#d4af37]/10 hover:shadow-[#d4af37]/20 transition-all bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] font-bold group">
                                    See {cityData.providerCount} Verified Providers in {CITY_OPTIONS.find(c => c.value === city)?.label}
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            <p className="text-xs text-center text-gray-400">
                                *Estimates only. Final pricing requires an in-person consultation.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Methodology Footnote */}
            <div className="lg:col-span-12 mt-8 pt-8 border-t border-white/[0.06]">
                <div className="max-w-3xl mx-auto text-center">
                    <PricingMethodology />
                </div>
            </div>
        </div>
    )
}
