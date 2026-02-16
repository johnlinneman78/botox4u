import Stripe from 'stripe'

export const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) return null

    return new Stripe(key, {
        apiVersion: '2025-01-27' as any,
        appInfo: {
            name: 'Botox Directory',
            version: '0.1.0',
        },
    })
}
