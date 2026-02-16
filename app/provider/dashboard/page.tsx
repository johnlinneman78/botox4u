import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getProviderDashboardData } from '@/lib/actions/providers'
import Link from 'next/link'

export default async function ProviderDashboardPage() {
    const data = await getProviderDashboardData()

    if (!data) return null

    const { provider, leads, stats } = data

    if (!provider) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <div className="text-6xl mb-6">🔍</div>
                <h1 className="text-3xl font-display font-bold text-primary mb-4">You haven&apos;t claimed a listing yet</h1>
                <p className="text-gray-600 mb-8">
                    To start receiving leads and managing your profile, you need to connect this account to a clinic listing.
                    Search for your clinic or create a new one.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/provider/claim">
                        <Button variant="primary" size="lg">Claim Existing Listing</Button>
                    </Link>
                    <Link href="/provider/new">
                        <Button variant="outline" size="lg">Create New Listing</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-primary">Dashboard Overview</h1>
                <p className="text-gray-500">Managing: <span className="font-bold text-secondary">{provider.name}</span></p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-none shadow-sm">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Leads</p>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-display font-bold text-primary">{stats.totalLeads}</span>
                            <span className="text-xs text-success font-medium mb-1">↑ 12% vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-sm">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Profile Views</p>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-display font-bold text-primary">{stats.profileViews}</span>
                            <span className="text-xs text-success font-medium mb-1">↑ 8% this week</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-sm">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Avg. Rating</p>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-display font-bold text-accent">★ {Number(stats.avgRating).toFixed(1)}</span>
                            <Link href="/provider/dashboard/reviews" className="text-xs text-secondary hover:underline mb-1">
                                View all reviews
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Leads */}
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg">Recent Leads</CardTitle>
                            <Link href="/provider/dashboard/leads">
                                <Button variant="ghost" size="sm">View All</Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-50">
                                {leads.length > 0 ? (
                                    leads.map((lead: any) => (
                                        <div key={lead.id} className="p-4 hover:bg-gray-50 transition-all flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold">
                                                    {lead.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-primary text-sm">{lead.full_name}</p>
                                                    <p className="text-xs text-gray-500">{lead.treatment_type} • {new Date(lead.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${lead.status === 'new' ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {lead.status.toUpperCase()}
                                                </span>
                                                <Button variant="outline" size="sm" className="h-8 py-0">Details</Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-gray-500">
                                        No leads received yet. Improve your profile description to attract more patients.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-6">
                    <Card className="bg-secondary text-white border-none shadow-lg">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-display font-bold mb-2">Upgrade to Elite</h3>
                            <p className="text-sm text-white/80 mb-6 font-light">
                                Get 5x more visibility and a "Verified Clinic" badge by upgrading to our Elite tier.
                            </p>
                            <Button className="w-full bg-white text-secondary hover:bg-white/90 font-bold border-none">
                                Compare Tiers
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Listing Tip</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-600 leading-relaxed">
                            Providers with a full bio and price list get <span className="text-secondary font-bold">40% more leads</span> on average.
                            <Link href="/provider/dashboard/profile" className="text-secondary ml-1 font-medium hover:underline">
                                Update yours today →
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
