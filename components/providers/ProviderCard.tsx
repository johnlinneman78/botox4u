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
        description?: string
        lat?: number
        lng?: number
    }
}

export function ProviderCard({ provider }: ProviderCardProps) {
    const isPremium = provider.listingTier === 'premium'

    const description = provider.description ||
        `${provider.name} is a top-rated aesthetic provider in ${provider.city}, ${provider.state}. They specialize in advanced ${provider.businessType || 'aesthetic'} treatments with a focus on natural, subtle results and patient safety.`

    return (
        <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white border-gray-100 ${isPremium ? 'border-secondary/30 ring-1 ring-secondary/20 shadow-lg' : ''
            }`}>
            {/* Premium Header/Banner */}
            {isPremium && (
                <div className="bg-primary text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-secondary" />
                        Top National Partner
                    </span>
                    <span className="text-secondary font-extrabold">Verified Excellence</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative w-full md:w-72 h-72 md:h-auto bg-gray-50 flex-shrink-0 overflow-hidden">
                    {provider.imageUrl ? (
                        <img
                            src={provider.imageUrl}
                            alt={`${provider.name} Clinic`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-1000 ease-out">
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800"
                                alt="Aesthetic Treatment Room"
                                className="w-full h-full object-cover opacity-40 mix-blend-multiply transition-opacity group-hover:opacity-50"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/40" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                <div className="w-12 h-12 mb-3 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <MapPin className="w-6 h-6 text-white/60" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Verified Clinic</span>
                            </div>
                        </div>
                    )}

                    {/* Floating Badges on Image */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                        {provider.verified && (
                            <Badge className="bg-white/95 text-primary border-none backdrop-blur-md shadow-md font-bold px-3 py-1 flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                                <span className="text-[10px] tracking-tight">VERIFIED PROVIDER</span>
                            </Badge>
                        )}
                        {provider.enriched_attrs?.top_account_status && (
                            <Badge className="bg-primary/90 text-secondary border-none backdrop-blur-md shadow-md px-3 py-1 font-bold">
                                💎 {provider.enriched_attrs.top_account_status}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 pr-4">
                            <h3 className="text-2xl md:text-3xl font-display font-bold text-primary group-hover:text-secondary transition-colors mb-2 leading-tight">
                                {provider.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-secondary" />
                                    {provider.city}, {provider.state}
                                </div>
                                <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
                                <div>{provider.businessType || 'Aesthetic Clinic'}</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                                <Star className="w-5 h-5 fill-secondary text-secondary" />
                                <span className="font-bold text-lg text-primary">{provider.averageRating || '5.0'}</span>
                                <span className="text-xs text-gray-400 font-medium">({provider.reviewCount || 'New'})</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6 font-light line-clamp-3">
                        {description}
                    </p>

                    {/* Differentiators / Credentials */}
                    <div className="flex flex-wrap gap-2.5 mb-8">
                        {provider.enriched_attrs?.injector_credentials?.slice(0, 3).map((cred, i) => (
                            <span key={i} className="px-3 py-1.5 bg-blue-50/50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-blue-100/50">
                                🩺 {cred}
                            </span>
                        ))}
                        {provider.enriched_attrs?.online_booking_available && (
                            <span className="px-3 py-1.5 bg-green-50/50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-green-100/50 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Book Online
                            </span>
                        )}
                        {provider.listingTier === 'premium' && (
                            <span className="px-3 py-1.5 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider rounded-lg border border-secondary/20">
                                Preferred Partner
                            </span>
                        )}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Pricing Transparency Box */}
                        <div className="flex items-center gap-8 w-full lg:w-auto overflow-x-auto pb-4 lg:pb-0">
                            {provider.pricePerUnit ? (
                                <div className="flex-shrink-0">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Botox Price</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-primary font-display">{formatCurrency(provider.pricePerUnit)}</span>
                                        <span className="text-xs text-gray-400 font-sans font-medium uppercase tracking-tighter">/ unit</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-400 italic flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-dashed border-gray-200">
                                    <Info className="w-4 h-4 text-secondary" /> Pricing by request
                                </div>
                            )}

                            {provider.enriched_attrs?.price_per_unit_dysport && (
                                <div className="hidden sm:block w-px h-10 bg-gray-200" />
                            )}

                            {provider.enriched_attrs?.price_per_unit_dysport && (
                                <div className="flex-shrink-0">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Dysport</div>
                                    <div className="text-xl font-bold text-gray-700 font-display">
                                        {formatCurrency(provider.enriched_attrs.price_per_unit_dysport)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CTAs */}
                        <div className="flex gap-4 w-full lg:w-auto">
                            <Link href={`/provider/${provider.slug}`} className="flex-1 lg:flex-initial">
                                <Button variant="outline" className="w-full border-gray-200 h-14 px-8 text-primary font-bold hover:border-secondary hover:text-secondary rounded-xl transition-all">
                                    View Full Profile
                                </Button>
                            </Link>
                            <Link href={`/provider/${provider.slug}#book`} className="flex-1 lg:flex-initial">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 h-14 px-10 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
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
