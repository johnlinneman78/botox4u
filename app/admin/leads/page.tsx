'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

// Client-side Supabase for real-time (or simple fetch)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Lead {
    id: string
    created_at: string
    full_name: string
    email: string
    phone: string
    city: string
    state: string
    treatment_type: string
    budget_range: string
    timeframe: string
    message: string
    status: string
    provider?: {
        name: string
    }
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLeads()
    }, [])

    const fetchLeads = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('leads')
            .select(`
                *,
                provider:providers(name)
            `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching leads:', error)
        } else {
            setLeads(data || [])
        }
        setLoading(false)
    }

    const updateStatus = async (leadId: string, newStatus: string) => {
        const { error } = await supabase
            .from('leads')
            .update({ status: newStatus })
            .eq('id', leadId)

        if (!error) {
            // Optimistic update
            setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0c10] text-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-[#3D2B1F] mb-2">Lead CRM</h1>
                        <p className="text-[#3D2B1F]/70">Manage and route incoming patient inquiries.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={fetchLeads} className="border-[#3D2B1F]/10 text-[#3D2B1F] hover:bg-[#3D2B1F]/5">
                            Refresh
                        </Button>
                    </div>
                </div>

                <Card className="bg-[#12151c]/50 border-[#3D2B1F]/10 backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-[#3D2B1F]/70 uppercase bg-[#3D2B1F]/5 border-b border-[#3D2B1F]/10">
                                <tr>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Patient</th>
                                    <th className="px-6 py-4">Request Details</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Assigned To</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-[#3D2B1F]/60">
                                            Loading leads...
                                        </td>
                                    </tr>
                                ) : leads.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-[#3D2B1F]/60">
                                            No leads found yet.
                                        </td>
                                    </tr>
                                ) : (
                                    leads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-[#3D2B1F]/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant={
                                                        lead.status === 'new' ? 'default' :
                                                            lead.status === 'contacted' ? 'secondary' :
                                                                lead.status === 'converted' ? 'premium' : 'outline'
                                                    }
                                                    className="capitalize"
                                                >
                                                    {lead.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-[#3D2B1F]">{lead.full_name}</div>
                                                <div className="text-[#3D2B1F]/70 text-xs">{lead.email}</div>
                                                <div className="text-[#3D2B1F]/70 text-xs">{lead.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-200">{lead.treatment_type}</div>
                                                <div className="text-[#3D2B1F]/60 text-xs mt-1">
                                                    Budget: {lead.budget_range}<br />
                                                    Time: {lead.timeframe}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {lead.city}, {lead.state}
                                            </td>
                                            <td className="px-6 py-4">
                                                {lead.provider?.name ? (
                                                    <span className="text-secondary font-medium">{lead.provider.name}</span>
                                                ) : (
                                                    <span className="text-[#3D2B1F]/50 italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-[#3D2B1F]/60">
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    className="bg-[#0a0c10] border border-[#3D2B1F]/10 rounded px-2 py-1 text-xs text-gray-300 focus:border-secondary outline-none"
                                                    value={lead.status}
                                                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="converted">Converted</option>
                                                    <option value="closed">Closed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
