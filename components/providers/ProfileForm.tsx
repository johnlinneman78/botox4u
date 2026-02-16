'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { updateProviderProfile } from '@/lib/actions/providers'

export function ProfileForm({ provider }: { provider: any }) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const result = await updateProviderProfile(formData)

        setLoading(false)
        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {message && (
                <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'
                    }`}>
                    {message.text}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Clinic Name</label>
                            <input
                                name="name"
                                defaultValue={provider.name}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Business Type</label>
                            <select
                                name="business_type"
                                defaultValue={provider.business_type}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none"
                            >
                                <option value="Medspa">Medspa</option>
                                <option value="Clinic">Clinic</option>
                                <option value="Dermatology">Dermatology</option>
                                <option value="Plastic Surgery">Plastic Surgery</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            defaultValue={provider.description}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none h-32"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pricing & Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price Per Unit ($)</label>
                            <input
                                name="price_per_unit"
                                type="number"
                                step="0.01"
                                defaultValue={provider.price_per_unit}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <input
                                name="phone"
                                defaultValue={provider.phone}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Website URL</label>
                        <input
                            name="website"
                            type="url"
                            defaultValue={provider.website}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Address</label>
                        <input
                            name="address"
                            defaultValue={provider.address}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary/20 outline-none"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button disabled={loading} type="submit" className="px-12 py-6 text-lg">
                    {loading ? 'Saving Changes...' : 'Save Profile'}
                </Button>
            </div>
        </form>
    )
}
