'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export default function ClaimListingPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [claiming, setClaiming] = useState<string | null>(null)

    const router = useRouter()
    const supabase = createClient()

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setLoading(true)
        const { data, error } = await supabase
            .from('providers')
            .select('*')
            .ilike('name', `%${searchQuery}%`)
            .is('user_id', null) // Only show unclaimed listings

        if (!error) setResults(data || [])
        setLoading(false)
    }

    const handleClaim = async (providerId: string) => {
        setClaiming(providerId)
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            router.push('/provider/login')
            return
        }

        const { error } = await supabase
            .from('providers')
            .update({ user_id: session.user.id })
            .eq('id', providerId)

        if (error) {
            alert('Error claiming listing. Please try again.')
            setClaiming(null)
        } else {
            router.push('/provider/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-display font-bold text-primary mb-4">Claim Your Listing</h1>
                    <p className="text-gray-600">Search for your clinic to manage your reviews, prices, and leads.</p>
                </div>

                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search by clinic name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none"
                            />
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Searching...' : 'Search'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {results.map((provider) => (
                        <Card key={provider.id} className="hover:border-secondary/30 transition-all">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-primary">{provider.name}</h3>
                                    <p className="text-sm text-gray-500">{provider.city}, {provider.state}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="verified">Unclaimed</Badge>
                                        <span className="text-xs text-gray-400">{provider.review_count} reviews</span>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleClaim(provider.id)}
                                    disabled={claiming === provider.id}
                                    variant="primary"
                                >
                                    {claiming === provider.id ? 'Claiming...' : 'This is Me'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    {searchQuery && !loading && results.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">We couldn&apos;t find your clinic in our directory.</p>
                            <Link href="/provider/new">
                                <Button variant="outline">Create a New Listing</Button>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center text-xs text-gray-400">
                    Can&apos;t find what you&apos;re looking for? <Link href="/provider/new" className="text-secondary underline">Add your business manually</Link>.
                </div>
            </div>
        </div>
    )
}
