
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeKey, {
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
