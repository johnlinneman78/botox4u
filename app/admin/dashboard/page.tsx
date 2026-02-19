import { getLeadStats, getRecentActivity } from '@/lib/actions/leads'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const stats = await getLeadStats()
    const activity = await getRecentActivity()

    return (
        <main className="min-h-screen bg-[#0a0c10] text-gray-100 py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <Badge variant="premium" className="mb-2 bg-secondary/20 text-secondary border-none">
                            ADMIN COMMAND CENTER
                        </Badge>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight">
                            Botox-4-U.com Performance
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mx-2"></div>
                        <span className="text-sm font-medium mr-4">System Live</span>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <Card className="bg-[#12151c]/50 border-white/5 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3">
                            <Badge className="bg-green-500/20 text-green-500 border-none text-[10px]">LIVE</Badge>
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-gray-400 text-xs font-bold uppercase tracking-widest">Today&apos;s Leads</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-black text-white group-hover:text-secondary transition-colors">{stats.todayLeads}</div>
                            <p className="text-xs text-secondary mt-2 font-bold">+ {stats.totalLeads > 0 ? Math.round(stats.todayLeads / stats.totalLeads * 100) : 0}% from total</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#12151c]/50 border-white/5 backdrop-blur-2xl shadow-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Pipeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-black text-white">{stats.totalLeads}</div>
                            <p className="text-xs text-gray-500 mt-2 font-medium">Capture Rate: 2.4% Est</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#12151c]/50 border-white/5 backdrop-blur-2xl shadow-2xl border-l-secondary/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-gray-400 text-xs font-bold uppercase tracking-widest">Pending Verif.</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-black text-white text-secondary">{stats.pendingVerifications}</div>
                            <p className="text-xs text-gray-500 mt-2 font-medium">Manual Audit Required</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#12151c]/50 border-white/5 backdrop-blur-2xl shadow-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-gray-400 text-xs font-bold uppercase tracking-widest">Quiet Prov.</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-black text-white">{stats.quietProviders || 490}+</div>
                            <p className="text-xs text-gray-500 mt-2 font-medium">Untapped Opportunities</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Recent Leads */}
                    <Card className="bg-[#12151c]/50 border-white/5 backdrop-blur-2xl">
                        <CardHeader>
                            <CardTitle className="text-white">Recent Leads</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activity.leads.length > 0 ? (
                                    activity.leads.map((lead: any) => (
                                        <div key={lead.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-white">{lead.full_name}</span>
                                                <span className="text-[10px] text-gray-500 uppercase">{new Date(lead.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                Inquiry for <span className="text-secondary">{lead.providers?.name || 'City-Wide'}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 flex gap-2 mt-1">
                                                <span>{lead.treatment_type}</span>
                                                <span>•</span>
                                                <span>{lead.city}, {lead.state}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-8 text-gray-500">No recent leads.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Claims */}
                    <Card className="bg-[#12151c]/50 border-white/5 backdrop-blur-2xl border-l-secondary/20">
                        <CardHeader>
                            <CardTitle className="text-white">Pending Claims</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activity.claims.length > 0 ? (
                                    activity.claims.map((claim: any) => (
                                        <div key={claim.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-white">{claim.name}</span>
                                                <Badge className="bg-secondary/20 text-secondary text-[10px] border-none uppercase">Claimed</Badge>
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {claim.city}, {claim.state}
                                            </div>
                                            <Link href={`/provider/${claim.slug}`} className="text-xs text-secondary hover:underline mt-1 inline-block">
                                                Review Listing →
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-8 text-gray-500">No pending claims.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Cities */}
                    <Card className="bg-[#12151c]/50 border-white/5 backdrop-blur-2xl">
                        <CardHeader>
                            <CardTitle className="text-white">Leads by City</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.leadsPerCity.length > 0 ? (
                                    stats.leadsPerCity.map(([city, count]: [string, any]) => (
                                        <div key={city} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                            <span className="font-bold">{city}</span>
                                            <Badge variant="premium" className="bg-secondary text-white border-none px-3">{count} leads</Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-gray-500">
                                        No leads captured yet.
                                        <Link href="/find-providers" className="text-secondary hover:underline ml-1">Test the flow →</Link>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Tools */}
                    <div className="space-y-6">
                        <Card className="bg-[#12151c]/50 border-white/5 backdrop-blur-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl -z-10"></div>
                            <CardHeader>
                                <CardTitle className="text-white">Outreach Shortlist</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                                    We have 500+ active listings. Start with Group A (Verified pricing) to maximize responses.
                                </p>
                                <div className="grid grid-cols-1 gap-2">
                                    <Link href="/docs/OUTREACH_STRATEGY.md" className="group">
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 group-hover:bg-secondary/10 group-hover:border-secondary/20 transition-all flex items-center justify-between">
                                            <span className="text-sm font-bold">🎯 View Outreach Plan</span>
                                            <span className="text-gray-500 group-hover:text-secondary group-hover:translate-x-1 transition-all">→</span>
                                        </div>
                                    </Link>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between grayscale opacity-50 cursor-not-allowed">
                                        <span className="text-sm font-bold">📤 Bulk Emailer (Coming Soon)</span>
                                        <span className="text-[10px] bg-gray-800 px-2 py-1 rounded">Locked</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-8 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl border border-secondary/20 backdrop-blur-sm">
                            <h3 className="text-xl font-display font-bold text-white mb-2">Next Milestone</h3>
                            <p className="text-sm text-gray-300 leading-relaxed mb-6">
                                Reach 10 claimed providers to unlock the automated sales dashboard & analytics deep-dive.
                            </p>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-secondary w-[10%] shadow-[0_0_15px_rgba(255,107,0,0.5)]"></div>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 uppercase font-black tracking-tighter">1 / 10 Providers Claimed</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
