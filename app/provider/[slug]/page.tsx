import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { getProviderBySlug } from '@/lib/actions/providers'
import { LeadForm } from '@/components/providers/LeadForm'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { MedicalDisclaimer } from '@/components/legal/MedicalDisclaimer'
import { ReviewCarousel } from '@/components/providers/ReviewCarousel'

interface ProviderProfileProps {
    params: { slug: string }
}

export async function generateMetadata({ params }: ProviderProfileProps): Promise<Metadata> {
    const resolvedParams = await params
    const provider = await getProviderBySlug(resolvedParams.slug)

    if (!provider) return { title: 'Provider Not Found' }

    return {
        title: `${provider.name} in ${provider.city} | Botox Prices & Reviews`,
        description: `View pricing, services, and reviews for ${provider.name} in ${provider.city}, ${provider.state}. Book a consultation for Botox and aesthetic treatments.`
    }
}

export default async function ProviderProfilePage({ params }: ProviderProfileProps) {
    const resolvedParams = await params
    const provider = await getProviderBySlug(resolvedParams.slug)

    if (!provider) {
        notFound()
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Profile Header */}
            <section className="relative bg-primary pt-20 pb-12 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 skew-x-12 transform origin-top-right"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        {/* Logo/Photo Placeholder */}
                        <div className="w-40 h-40 bg-white rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl backdrop-blur-md relative overflow-hidden shrink-0 group">
                            {provider.imageUrl ? (
                                <img
                                    src={provider.imageUrl}
                                    alt={provider.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-6xl group-hover:scale-110 transition-transform duration-500">🏥</span>
                            )}
                            {provider.listingTier === 'premium' && (
                                <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-2 text-xl rounded-full shadow-lg border-2 border-white">
                                    ★
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
                                <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                                    {provider.name}
                                </h1>
                                {provider.verified && (
                                    <Badge variant="verified" className="bg-success/20 text-success-foreground border-success/30">
                                        VERIFIED
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-gray-300 mb-8 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-secondary text-lg">★</span>
                                    <span className="text-white font-bold">{provider.averageRating || 'New'}</span>
                                    <span className="text-sm opacity-60">({provider.reviewCount} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-secondary opacity-60">📍</span>
                                    <span>{provider.city}, {provider.state}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-secondary opacity-60">💼</span>
                                    <span>{provider.businessType}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <a href="#quote-form">
                                    <Button variant="primary" size="lg" className="px-10 h-14 text-lg bg-secondary hover:bg-secondary/90 shadow-xl shadow-secondary/20">
                                        Book Consultation
                                    </Button>
                                </a>
                                {provider.website && (
                                    <a href={provider.website} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="lg" className="h-14 px-8 border-white/20 text-white hover:bg-white/10">
                                            Official Website
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Sections */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="lg:w-2/3 space-y-12">
                            {/* About */}
                            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
                                <h2 className="text-2xl font-display font-bold text-primary mb-6">About the Clinic</h2>
                                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                                    {provider.description || `${provider.name} is a premier ${provider.businessType} located in ${provider.city}. They specialize in providing high-quality aesthetic treatments tailored to individual patient goals.`}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl">
                                    {provider.enriched_attrs?.injector_credentials?.map((cred: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 text-sm font-semibold text-primary">
                                            <span className="text-secondary text-xs">✔</span> {cred}
                                        </div>
                                    ))}
                                    {provider.enriched_attrs?.offers_masseter_botox && (
                                        <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                                            <span className="text-secondary text-xs">✔</span> Masseter/Jaw Specialist
                                        </div>
                                    )}
                                    {provider.enriched_attrs?.online_booking_available && (
                                        <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                                            <span className="text-secondary text-xs">✔</span> Online Booking Supported
                                        </div>
                                    )}
                                    {provider.enriched_attrs?.membership_program && (
                                        <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                                            <span className="text-secondary text-xs">✔</span> Membership Program Available
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Services */}
                            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
                                <h2 className="text-2xl font-display font-bold text-primary mb-6">Services & Pricing</h2>
                                <div className="space-y-4">
                                    {(provider.pricePerUnit || provider.enriched_attrs?.price_per_unit_botox) && (
                                        <div className="flex justify-between items-center p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                                            <span className="font-bold text-primary">Botox Pricing</span>
                                            <span className="text-secondary font-black text-xl">{formatCurrency(Number(provider.pricePerUnit || provider.enriched_attrs?.price_per_unit_botox))}/unit</span>
                                        </div>
                                    )}
                                    {provider.enriched_attrs?.price_per_unit_dysport && (
                                        <div className="flex justify-between items-center p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                            <span className="font-bold text-primary">Dysport Pricing</span>
                                            <span className="text-blue-600 font-black text-xl">{formatCurrency(Number(provider.enriched_attrs.price_per_unit_dysport))}/unit</span>
                                        </div>
                                    )}
                                    {provider.enriched_attrs?.new_patient_special && (
                                        <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-green-800 font-medium">
                                            🎁 <span className="font-bold">New Patient Special:</span> {provider.enriched_attrs.new_patient_special}
                                        </div>
                                    )}
                                </div>
                                <p className="text-[11px] text-gray-400 mt-6 italic bg-gray-50 p-3 rounded-lg text-center">
                                    Note: Final treatment costs vary by patient. A formal consultation is required for exact pricing.
                                </p>
                            </div>

                            {/* Reviews */}
                            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
                                <ReviewCarousel
                                    reviews={provider.top_reviews || provider.reviews || []}
                                    totalReviews={provider.reviewCount || 0}
                                    googlePlaceId={provider.google_place_id || ''}
                                />
                            </div>
                        </div>

                        <div className="lg:w-1/3">
                            <div className="sticky top-24 space-y-8">
                                {/* Lead Form */}
                                <div id="quote-form">
                                    <LeadForm
                                        providerId={provider.id}
                                        providerName={provider.name}
                                        isPremium={provider.listingTier === 'premium'}
                                    />
                                </div>

                                {/* Quick Contact */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-xl font-display font-bold text-primary mb-6">Clinic Info</h3>
                                    <div className="space-y-6">
                                        {provider.phone && (
                                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                                                <span className="text-2xl">📱</span>
                                                <div>
                                                    <div className="text-xs text-gray-400 font-bold uppercase mb-0.5">Phone</div>
                                                    <a href={`tel:${provider.phone}`} className="text-lg font-bold text-primary hover:text-secondary transition-colors">
                                                        {provider.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                                            <span className="text-2xl">🏠</span>
                                            <div>
                                                <div className="text-xs text-gray-400 font-bold uppercase mb-0.5">Location</div>
                                                <div className="text-sm font-semibold text-gray-700">
                                                    {provider.address}<br />
                                                    {provider.city}, {provider.state}
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full h-12 rounded-xl">
                                            Get Directions
                                        </Button>
                                    </div>
                                </div>

                                {/* Claim Listing CTA */}
                                {!provider.verified && (
                                    <div className="bg-gradient-to-br from-primary to-primary/90 p-8 rounded-3xl text-white shadow-xl shadow-primary/20">
                                        <h3 className="text-xl font-display font-bold mb-4">Are you the owner?</h3>
                                        <p className="text-sm text-primary-foreground/80 leading-relaxed mb-6">
                                            Claim your profile to update pricing, respond to reviews, and reach more patients in {provider.city}.
                                        </p>
                                        <Button className="w-full bg-secondary hover:bg-secondary/90 text-white border-0 py-6 text-md font-bold shadow-lg">
                                            Claim This Listing
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12">
                        <MedicalDisclaimer variant="compact" />
                    </div>
                </div>
            </section>
        </div>
    )
}
