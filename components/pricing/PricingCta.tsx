'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

// PARKED Nov 5, 2026 (John's decision): provider pricing is paused and
// no payment can be started. The free plan still routes to /claim.
// Any paid planId renders a disabled button and never calls checkout.
// When pricing returns, restore the checkout call from git history.

interface PricingCtaProps {
    planId: 'free' | 'verified' | 'featured';
    providerId?: string;
    isLoggedIn: boolean;
    className?: string;
}

export function PricingCta({ planId, isLoggedIn, className }: PricingCtaProps) {
    const [loading, setLoading] = useState(false);

    const handleFree = () => {
        setLoading(true);
        window.location.href = isLoggedIn ? '/provider/login' : '/claim';
    };

    if (planId !== 'free') {
        return (
            <Button disabled className={className}>
                Paused
            </Button>
        );
    }

    return (
        <Button
            onClick={handleFree}
            disabled={loading}
            className={className}
        >
            {loading ? 'Processing...' : 'Get Started Now'}
        </Button>
    );
}
