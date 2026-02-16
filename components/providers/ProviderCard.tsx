import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

interface ProviderCardProps {
    provider: {
        id: string
        name: string
        slug: string
        businessType: string
        address: string
        city: string
        state: string
        averageRating: number
        reviewCount: number
        listingTier: 'free' | 'featured' | 'premium'
        verified: boolean
        pricePerUnit?: number
        minTreatmentPrice?: number
        imageUrl?: string
    }
}

export function ProviderCard({ provider }: ProviderCardProps) {
    return (
        <Card className={`overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-secondary/20 ${provider.listingTier === 'premium' ? 'border-secondary/30 bg-secondary/[0.02]' : ''
            }`}>
            <div className="flex flex-col md:flex-row">
                {/* Provider Photo Placeholder */}
                <div className="relative w-full md:w-48 h-48 md:h-auto bg-gray-100 flex items-center justify-center shrink-0">
                    <span className="text-4xl">🏥</span>
                    {provider.listingTier !== 'free' && (
                        <div className="absolute top-2 left-2">
                            <Badge variant={provider.listingTier === 'premium' ? 'premium' : 'featured'}>
                                {provider.listingTier.toUpperCase()}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Provider Details */}
                <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-display font-bold text-primary group-hover:text-secondary">
                                        {provider.name}
                                    </h3>
                                    {provider.verified && (
                                        <Badge variant="verified" className="px-1.5 py-0">
                                            <span className="text-[10px]">VERIFIED</span>
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mb-2">
                                    {provider.businessType} • {provider.city}, {provider.state}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end text-accent mb-1">
                                    <span className="text-lg font-bold">★</span>
                                    <span className="ml-1 text-sm font-semibold text-primary">{provider.averageRating}</span>
                                    <span className="ml-1 text-xs text-gray-400">({provider.reviewCount})</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-auto">
                            {provider.pricePerUnit && (
                                <div className="text-sm">
                                    <span className="text-gray-500">Price/Unit:</span>
                                    <span className="ml-1 font-semibold text-primary">{formatCurrency(provider.pricePerUnit)}</span>
                                </div>
                            )}
                            {provider.minTreatmentPrice && (
                                <div className="text-sm">
                                    <span className="text-gray-500">From:</span>
                                    <span className="ml-1 font-semibold text-primary">{formatCurrency(provider.minTreatmentPrice)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Link href={`/provider/${provider.slug}`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                    View Profile
                                </Button>
                            </Link>
                            <Button variant="primary" className="flex-1">
                                Book Consultation
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
