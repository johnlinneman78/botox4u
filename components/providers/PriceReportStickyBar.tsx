'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

// Persistent price-report call to action for city pages.
//
// Why this exists (Nov 3, 2026): the full PriceReportCTA sits below the
// hero, stats, and map on city pages, and the form itself stays hidden
// behind an "Add what you paid" button. Visitors never saw it. This bar
// stays visible at the bottom of the screen, links to the form anchor,
// and can be dismissed for the session. It collects nothing itself.
export function PriceReportStickyBar({ city }: { city?: string }) {
    const [dismissed, setDismissed] = useState(false)
    if (dismissed) return null
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#3D2B1F]/10 bg-[#3D2B1F] text-[#FAF8F5] px-4 py-3">
            <div className="mx-auto max-w-5xl flex items-center gap-3">
                <p className="flex-1 text-sm leading-snug">
                    <strong>What did you pay{city ? ` in ${city}` : ''}?</strong>{' '}
                    <span className="opacity-80">30 seconds, anonymous — and it helps the next person know what they should pay.</span>
                </p>
                <a href="#price-report" className="shrink-0">
                    <Button size="sm">Add what you paid</Button>
                </a>
                <button
                    type="button"
                    aria-label="Dismiss"
                    onClick={() => setDismissed(true)}
                    className="shrink-0 text-lg leading-none opacity-70 hover:opacity-100 px-1"
                >
                    ×
                </button>
            </div>
        </div>
    )
}
