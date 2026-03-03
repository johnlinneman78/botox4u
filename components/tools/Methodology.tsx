import React from 'react'

export function PricingMethodology() {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">How we calculate this</h3>
            <p className="text-sm text-[#3D2B1F]/60 leading-relaxed">
                Our pricing engine analyzes over 500 verified provider listings across the US, updated weekly.
                We segment providers into three tiers (Budget, Standard, Premium) based on their published per-unit pricing,
                clinic amenities, and injector credentials. The unit counts above represent standard dosages for FDA-approved treatment areas,
                though individual anatomy varies significantly.
            </p>
        </div>
    )
}
