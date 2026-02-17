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
        enriched_attrs?: {
            price_per_unit_botox?: number
            price_per_unit_dysport?: number
            membership_program?: boolean
            new_patient_special?: string
            phone_number?: string
            contact_url?: string
            online_booking_available?: boolean
            injector_credentials?: string[]
            offers_masseter_botox?: boolean
            offers_gummy_smile?: boolean
            offers_lip_flip?: boolean
            offers_hyperhidrosis?: boolean
            top_account_status?: string
            years_in_business?: number
        }
        website?: string
    }
}

export function ProviderCard({ provider }: ProviderCardProps) {
    const isPremium = provider.listingTier === 'premium'
    const isFeatured = provider.listingTier === 'featured'

    return (
        <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${isPremium ? 'border-secondary/40 ring-1 ring-secondary/20 bg-gradient-to-br from-secondary/[0.03] to-white shadow-xl shadow-secondary/5' : ''
            }`}>
            {isPremium && (
                <div className="absolute top-0 right-0 z-30">
                    <div className="bg-secondary text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl shadow-lg border-l border-b border-white/20 tracking-tighter uppercase">
                        ⭐ Top National Choice
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row">
                {/* Provider Photo Placeholder */}
                <div className="relative w-full md:w-56 h-56 md:h-auto bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden group">
                    {provider.imageUrl ? (
                        <img
                            src={provider.imageUrl}
                            alt={provider.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <span className="text-5xl group-hover:scale-110 transition-transform duration-500">🏥</span>
                    )}
                    {isPremium && (
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none" />
                    )}
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
                            {provider.pricePerUnit ? (
                                <div className="text-sm">
                                    <span className="text-gray-500">Price/Unit:</span>
                                    <span className="ml-1 font-semibold text-primary">{formatCurrency(provider.pricePerUnit)}</span>
                                </div>
                            ) : (
                                <div className="text-sm">
                                    <span className="text-gray-500 italic">Price not listed</span>
                                    <Badge variant="outline" className="ml-2 py-0 h-5 text-[10px] text-secondary border-secondary/20 bg-secondary/5">
                                        REQUEST QUOTE
                                    </Badge>
                                </div>
                            )}
                            {provider.minTreatmentPrice && (
                                <div className="text-sm">
                                    <span className="text-gray-500">From:</span>
                                    <span className="ml-1 font-semibold text-primary">{formatCurrency(provider.minTreatmentPrice)}</span>
                                </div>
                            )}
                        </div>

                        {/* Enriched Attribute Highlights */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {provider.enriched_attrs?.top_account_status && (
                                <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-amber-700 text-white border-none shadow-sm font-bold tracking-tight">
                                    💎 {provider.enriched_attrs.top_account_status}
                                </Badge>
                            )}
                            {provider.enriched_attrs?.injector_credentials && provider.enriched_attrs.injector_credentials.length > 0 && (
                                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                                    Staff: {provider.enriched_attrs.injector_credentials.join(', ')}
                                </Badge>
                            )}
                            {provider.enriched_attrs?.offers_masseter_botox && (
                                <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none hover:bg-secondary/20 font-medium">
                                    Jaw Slimming Specialist
                                </Badge>
                            )}
                            {provider.enriched_attrs?.new_patient_special && (
                                <Badge className="bg-green-50 text-green-700 border-green-100 hover:bg-green-100 animate-pulse-subtle">
                                    🎁 {provider.enriched_attrs.new_patient_special}
                                </Badge>
                            )}
                            {provider.enriched_attrs?.online_booking_available && (
                                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                                    ✓ Online Booking
                                </Badge>
                            )}
                        </div>

                        {/* Toxin Specific Pricing */}
                        {(provider.enriched_attrs?.price_per_unit_botox || provider.enriched_attrs?.price_per_unit_dysport) && (
                            <div className="flex gap-4 mt-3 text-[11px] font-medium text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                {provider.enriched_attrs.price_per_unit_botox && (
                                    <span>Botox: <span className="text-primary font-bold">{formatCurrency(provider.enriched_attrs.price_per_unit_botox)}/u</span></span>
                                )}
                                {provider.enriched_attrs.price_per_unit_dysport && (
                                    <span>Dysport: <span className="text-primary font-bold">{formatCurrency(provider.enriched_attrs.price_per_unit_dysport)}/u</span></span>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <Link href={`/provider/${provider.slug}#quote-form`} className="flex-[1.5] order-1 sm:order-2">
                                <Button className="w-full h-11 bg-secondary hover:bg-secondary/90 text-white font-bold shadow-lg shadow-secondary/10 border-none transition-all hover:scale-[1.02]">
                                    {provider.pricePerUnit ? 'Check Availability' : 'Request Pricing & Availability'}
                                </Button>
                            </Link>
                            <a
                                href={provider.website || provider.enriched_attrs?.contact_url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 order-2 sm:order-1"
                            >
                                <Button variant="outline" className="w-full h-11 border-gray-200 text-gray-400 hover:bg-gray-50 font-medium">
                                    View Profile
                                </Button>
                            </a>
                        </div>

                        {provider.minTreatmentPrice && isPremium && (
                            <div className="mt-4 p-3 bg-secondary/5 border border-secondary/10 rounded-xl text-xs text-secondary-foreground font-medium flex items-center gap-2">
                                <span className="bg-secondary text-white p-1 rounded-full text-[8px] leading-none">★</span>
                                This clinic is a verified Botox-4-U.com Premium Partner
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}
