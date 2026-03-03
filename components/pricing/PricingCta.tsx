
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createCheckoutSession } from '@/lib/actions/checkout';

interface PricingCtaProps {
    planId: 'free' | 'verified' | 'featured';
    providerId?: string;
    isLoggedIn: boolean;
    className?: string;
}

export function PricingCta({ planId, providerId, isLoggedIn, className }: PricingCtaProps) {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        // Handle Free Plan
        if (planId === 'free') {
            window.location.href = isLoggedIn ? '/provider/login' : '/claim';
            return;
        }

        if (!isLoggedIn) {
            window.location.href = `/claim?plan=${planId}&providerId=${providerId || ''}`;
            return;
        }

        if (!providerId) {
            // If logged in but no provider ID, they need to claim it first or we need to find it
            window.location.href = `/provider/signup?plan=${planId}`;
            return;
        }

        try {
            setLoading(true);
            await createCheckoutSession(providerId, planId);
        } catch (error) {
            console.error('Upgrade failed:', error);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleUpgrade}
            disabled={loading}
            className={className}
        >
            {loading ? 'Processing...' : 'Get Started Now'}
        </Button>
    );
}
