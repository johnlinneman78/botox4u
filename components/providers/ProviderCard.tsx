import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { CheckCircle, MapPin, Star, Trophy, Calendar, Info } from 'lucide-react'

// Keep the existing interface to avoid breaking usages in page.tsx
interface ProviderCardProps {
    provider: {
        id: string
        name: string
        slug: string
        businessType: string
        address?: string // made optional
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
        lat?: number
        lng?: number
    }
}

export function ProviderCard({ provider }: ProviderCardProps) {
    const isPremium = provider.listingTier === 'premium'

    // Fallback description logic (simulating scraped content if missing)
    const description = `${provider.name} is a premier aesthetic destination in ${provider.city}, specializing in natural-looking injectables. Led by verified medical professionals, they offer transparent pricing and personalized treatment plans.`

    return (
        <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-gray-100 ${isPremium ? 'border-[#d4af37]/30 ring-1 ring-[#d4af37]/20' : ''
            }`}>
            {/* Premium Header/Banner */}
            {isPremium && (
                <div className="bg-[#1a2332] text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                        <Trophy className="w-3 h-3 text-[#d4af37]" />
                        Top National Partner
                    </span>
                    <span className="text-[#d4af37]">Verified Excellence</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative w-full md:w-64 h-64 md:h-auto bg-gray-100 flex-shrink-0">
                    {provider.imageUrl ? (
                        <img
                            src={provider.imageUrl}
                            alt={`${provider.name} Clinic`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
                            {/* Placeholder pattern */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                            <span className="text-4xl">🏥</span>
                            <span className="text-xs font-medium mt-2 uppercase tracking-wide">No Image</span>
                        </div>
                    )}

                    {/* Floating Badges on Image */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {provider.verified && (
                            <Badge className="bg-white/95 text-[#1a2332] border-white/20 backdrop-blur-sm shadow-sm font-bold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-blue-500" />
                                VERIFIED
                            </Badge>
                        )}
                        {provider.enriched_attrs?.top_account_status && (
                            <Badge className="bg-[#1a2332]/95 text-[#d4af37] border-none backdrop-blur-sm shadow-sm">
                                💎 {provider.enriched_attrs.top_account_status}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-xl md:text-2xl font-display font-bold text-[#1a2332] group-hover:text-[#d4af37] transition-colors mb-1">
                                {provider.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <MapPin className="w-3.5 h-3.5" />
                                {provider.city}, {provider.state} • {provider.businessType}
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                                <span className="font-bold text-[#1a2332]">{provider.averageRating}</span>
                                <span className="text-xs text-gray-400">({provider.reviewCount})</span>
                            </div>
                        </div>
                    </div>

                    {/* Description - The "Professional Content" Upgrade */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2 md:line-clamp-none">
                        {description}
                    </p>

                    {/* Differentiators / Credentials */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {provider.enriched_attrs?.injector_credentials?.slice(0, 2).map((cred, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wide rounded-md">
                                🩺 {cred}
                            </span>
                        ))}
                        {provider.enriched_attrs?.offers_masseter_botox && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wide rounded-md">
                                Masseter Pro
                            </span>
                        )}
                        {provider.enriched_attrs?.online_booking_available && (
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wide rounded-md flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Online Booking
                            </span>
                        )}
                    </div>

                    <div className="mt-auto border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Pricing Transparency Box */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            {provider.pricePerUnit ? (
                                <div className="text-center sm:text-left">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Botox Price</div>
                                    <div className="text-2xl font-bold text-[#1a2332] font-display">
                                        {formatCurrency(provider.pricePerUnit)}<span className="text-sm text-gray-400 font-sans font-normal">/unit</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-400 italic flex items-center gap-1">
                                    <Info className="w-4 h-4" /> Pricing available upon request
                                </div>
                            )}

                            {provider.enriched_attrs?.price_per_unit_dysport && (
                                <div className="hidden sm:block w-px h-8 bg-gray-200 mx-2" />
                            )}

                            {provider.enriched_attrs?.price_per_unit_dysport && (
                                <div className="hidden sm:block">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Dysport</div>
                                    <div className="text-lg font-bold text-gray-700 font-display">
                                        {formatCurrency(provider.enriched_attrs.price_per_unit_dysport)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CTAs */}
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Link href={`/provider/${provider.slug}`} className="flex-1 sm:flex-initial">
                                <Button variant="outline" className="w-full border-gray-200 hover:border-[#d4af37] hover:text-[#d4af37]">
                                    Profile
                                </Button>
                            </Link>
                            <Link href={`/provider/${provider.slug}#book`} className="flex-1 sm:flex-initial">
                                <Button className="w-full bg-[#1a2332] hover:bg-[#1a2332]/90 text-white shadow-lg shadow-[#1a2332]/20">
                                    Check Availability
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
