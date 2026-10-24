'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { PriceReportWidget } from '@/components/providers/PriceReportWidget'

// Price-report call to action — price-guide phase 1.
//
// Placement: RIGHT THERE on provider pages and city pages, adjacent to
// where prices are shown — especially where a clinic shows no published
// price. Never buried in a footer or nav menu.
//
// COPY STATUS: APPROVED as written by the owner for the widget build
// (Oct 24), with ONE pre-ship change ordered at ship time (Oct 24):
// "You get the full guide" became "You help build the guide," because
// phase 1 has no guide unlock — that mechanic is phase 4. The rest of
// the approved copy is verbatim. Nothing user-submitted displays
// publicly in phase 1.

interface PriceReportCTAProps {
    variant?: 'full' | 'missing-price'
    providerId?: string
    providerName?: string
    city?: string | null
    state?: string | null
}

export function PriceReportCTA({
    variant = 'full',
    providerId,
    providerName,
    city,
    state,
}: PriceReportCTAProps) {
    const [expanded, setExpanded] = useState(false)

    const detailed = Boolean(providerId && providerName)

    return (
        <div className="my-8 rounded-[2rem] border border-[#3D2B1F]/10 bg-[#FAF8F5] p-6 md:p-8">
            {variant === 'missing-price' ? (
                <>
                    <p className="font-display text-xl md:text-2xl font-medium text-[#3D2B1F] leading-snug">
                        No price published here yet. Were you treated here? Add what you paid.
                    </p>
                    <p className="text-[#3D2B1F]/60 leading-relaxed mt-3">
                        Anonymous, about 30 seconds. Your report goes to a review queue first — we never show one
                        person&apos;s report on its own.
                    </p>
                </>
            ) : (
                <>
                    <h2 className="font-display text-2xl md:text-3xl font-medium text-[#3D2B1F] leading-snug">
                        Nobody will tell you the price. So we tell each other.
                    </h2>
                    <p className="text-[#3D2B1F]/70 leading-relaxed mt-4">
                        Clinics hide prices on purpose. The only real prices here came from people like you, who got
                        treated and shared what they paid. Add yours. 30 seconds. Anonymous. You help build the guide,
                        and the next person walks in knowing what they should pay.
                    </p>
                    <ul className="mt-4 space-y-2 text-[#3D2B1F]/80">
                        <li>✓ Make an informed decision</li>
                        <li>✓ Walk in with negotiation power</li>
                        <li>✓ Know what you should be paying</li>
                    </ul>
                </>
            )}

            {!expanded ? (
                <Button size="lg" className="mt-6 w-full sm:w-auto" onClick={() => setExpanded(true)}>
                    Add what you paid
                </Button>
            ) : (
                <div className="mt-6">
                    <PriceReportWidget
                        initialPath={detailed ? 'detailed' : 'quick'}
                        initialClinic={
                            detailed
                                ? { id: providerId as string, name: providerName as string, city: city ?? null, state: state ?? null }
                                : null
                        }
                        initialCity={!detailed ? (city ?? undefined) : undefined}
                    />
                </div>
            )}
        </div>
    )
}
