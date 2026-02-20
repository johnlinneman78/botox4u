
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16' as any,
    typescript: true,
});

export const STRIPE_PLANS = {
    starter: {
        id: 'starter',
        name: 'Starter',
        priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter_placeholder',
        amount: 99
    },
    featured: {
        id: 'featured',
        name: 'Featured',
        priceId: process.env.STRIPE_FEATURED_PRICE_ID || 'price_featured_placeholder',
        amount: 149
    },
    premium: {
        id: 'premium',
        name: 'Premium',
        priceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_placeholder',
        amount: 299
    }
};
