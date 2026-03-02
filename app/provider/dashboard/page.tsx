import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { ExternalLink, Sparkles, User, LogOut } from 'lucide-react'
import TierBadge from '../_components/TierBadge'
import TrueScoreCard from '../_components/TrueScoreCard'
import StatsCard from '../_components/StatsCard'
import BillingButton from '../_components/BillingButton'
import ListingLink from '../_components/ListingLink'
import Logo from '@/components/layout/Logo'

export default async function ProviderDashboard() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/provider/login')

    // Find provider associated with this user
    const { data: provider, error } = await supabase
        .from('providers')
        .select('id, name, listing_tier, score, slug, stripe_customer_id, views_30d, clicks_30d')
        .eq('user_id', session.user.id)
        .single()

    if (error || !provider) {
        console.error('Provider association error:', error)
        redirect('/provider/login?error=no-association')
    }

    return (
        <main className="min-h-screen bg-[#0d1420] text-white">
            {/* Top Navbar */}
            <nav className="border-b border-white/5 py-6 mb-12 bg-black/20 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
                    <Logo className="h-8 w-auto" />
                    <div className="flex items-center gap-6">
                        <form action="/auth/signout" method="post">
                            <button className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                                Sign Out <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 pb-24">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <TierBadge tier={provider.listing_tier || 'free'} />
                            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Active Provider Profile</span>
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                                {provider.name}
                            </h1>
                            <p className="text-gray-400 font-light text-lg mt-2 leading-relaxed">
                                Welcome back. Here's your clinical performance data for 2026.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37] shadow-2xl">
                            <User className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Core Data */}
                    <div className="lg:col-span-12 space-y-8">

                        {/* TrueScore Large Card */}
                        <TrueScoreCard score={provider.score || 0} />

                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StatsCard
                                label="Patient Profile Views"
                                value={provider.views_30d ?? 0}
                                period="Past 30 Days"
                            />
                            <StatsCard
                                label="Outbound Website Clicks"
                                value={provider.clicks_30d ?? 0}
                                period="Past 30 Days"
                            />
                        </div>

                        {/* Bottom Actions Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-white/5 mt-12">
                            <ListingLink slug={provider.slug} />
                            <BillingButton customerId={provider.stripe_customer_id} />
                        </div>

                        {/* Beta Help Alert */}
                        <div className="bg-[#d4af37]/5 border border-[#d4af37]/15 rounded-3xl p-8 flex items-start gap-5 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#d4af37]/40" />
                            <Sparkles className="w-6 h-6 text-[#d4af37] shrink-0 mt-1" />
                            <div>
                                <h4 className="text-sm font-bold text-[#d4af37] uppercase tracking-widest mb-2">Private Beta Support</h4>
                                <p className="text-gray-400 text-sm leading-relaxed font-light">
                                    We are currently rolling out additional analytics including review sentiment analysis and Google Search console mapping. If you need a custom audit or location update, please contact John directly at <span className="text-white font-medium">hello@injectorindex.com</span>
                                </p>
                            </div>
                        </div>

                        <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest text-center mt-12">
                            InjectorIndex Dashboard V1.1.0 • Built for Clinical Outcomes
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
