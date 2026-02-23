'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { slugify } from '@/lib/utils'

export default function NewListingPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        name: '',
        city: '',
        state: '',
        business_type: 'Medspa',
        phone: '',
        website: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/provider/login')
            return
        }

        const slug = slugify(formData.name)

        const { error: insertError } = await supabase
            .from('providers')
            .insert([
                {
                    ...formData,
                    slug,
                    user_id: session.user.id,
                    listing_tier: 'free',
                    verified: false,
                },
            ])

        if (insertError) {
            if (insertError.code === '23505') {
                setError('A clinic with this name already exists. Try searching for it in the Claim page.')
            } else {
                setError('Error creating listing: ' + insertError.message)
            }
            setLoading(false)
        } else {
            router.push('/provider/login?success=new_listing')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-display font-bold text-primary mb-4">Add Your Clinic</h1>
                    <p className="text-gray-600">Grow your business by reaching more local aesthetic patients.</p>
                </div>

                <Card className="shadow-xl">
                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 bg-error/10 border border-error/20 text-error text-xs rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none"
                                        placeholder="Ex: Beverly Hills Aesthetics"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none"
                                        placeholder="Ex: Los Angeles"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State (2 Letter Code)</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={2}
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none"
                                        placeholder="Ex: CA"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                                    <select
                                        value={formData.business_type}
                                        onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none"
                                    >
                                        <option value="Medspa">Medspa</option>
                                        <option value="Clinic">Clinic</option>
                                        <option value="Dermatology">Dermatology</option>
                                        <option value="Plastic Surgery">Plastic Surgery</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none"
                                        placeholder="310-555-0123"
                                    />
                                </div>
                            </div>

                            <Button type="submit" disabled={loading} className="w-full py-6 text-lg font-bold">
                                {loading ? 'Creating Listing...' : 'Create My Listing'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
