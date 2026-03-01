
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeKey, {
    apiVersion: '2023-10-16' as any,
    typescript: true,
});

export const STRIPE_PLANS = {
    verified: {
        id: 'verified',
        name: 'Verified',
        priceId: process.env.STRIPE_VERIFIED_PRICE_ID || 'price_verified_placeholder',
        amount: 49
    },
    featured: {
        id: 'featured',
        name: 'Featured',
        priceId: process.env.STRIPE_FEATURED_PRICE_ID || 'price_featured_placeholder',
        amount: 99
    },
    api_starter: {
        id: 'api_starter',
        name: 'API Starter',
        priceId: process.env.STRIPE_API_STARTER_PRICE_ID || 'price_api_starter_placeholder',
        amount: 29
    },
    api_pro: {
        id: 'api_pro',
        name: 'API Pro',
        priceId: process.env.STRIPE_API_PRO_PRICE_ID || 'price_api_pro_placeholder',
        amount: 99
    }
};
