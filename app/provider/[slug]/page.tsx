import Link from 'next/link'
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
        title: `${provider.name} | Botox in ${provider.city}, ${provider.state} | Botox-4U`,
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
            {/* Hero Image Section */}
            <section className="relative h-[300px] md:h-[450px] w-full overflow-hidden">
                <img
                    src={provider.hero_image_url || provider.imageUrl || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1600"}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full pb-8">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl">
                            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2">
                                {provider.name}
                            </h1>
                            <div className="flex items-center gap-3 text-white/90 text-sm md:text-base font-medium">
                                <span className="flex items-center gap-1">📍 {provider.city}, {provider.state}</span>
                                <span className="w-1 h-1 rounded-full bg-white/40"></span>
                                <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                                            {provider.averageRating || 'New'} <span className="text-yellow-400 text-xl">★</span>
                                        </div>
                                        <div className="text-[10px] text-white/50 font-bold uppercase tracking-tighter">Rating from Google</div>
                                    </div>
                                    <div className="w-px h-8 bg-white/20"></div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="text-sm font-semibold text-white/90">{provider.reviewCount} Patient Reviews</div>
                                        <img
                                            src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white2.png"
                                            alt="Powered by Google"
                                            className="h-3.5 w-fit"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Header (Legacy support/Details) */}
            <section className="relative bg-white pt-12 pb-8 border-b border-gray-100">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        {/* Logo/Photo Placeholder */}
                        <div className="w-40 h-40 bg-white rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl backdrop-blur-md relative overflow-hidden shrink-0 group">
                            {provider.imageUrl && !provider.imageUrl.includes('placeholder') && provider.imageUrl.length > 5 ? (
                                <img
                                    src={provider.imageUrl}
                                    alt={provider.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
                                    alt="Default Clinic"
                                    className="w-full h-full object-cover opacity-80"
                                />
                            )}
                            {provider.listingTier === 'premium' && (
                                <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-2 text-xl rounded-full shadow-lg border-2 border-white">
                                    ★
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
                                <div className="text-2xl font-display font-bold text-primary">
                                    Clinic Profile
                                </div>
                                {provider.verified && (
                                    <Badge variant="verified" className="bg-success/20 text-success-foreground border-success/30">
                                        VERIFIED
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-gray-500 mb-8 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-secondary text-lg">★</span>
                                    <span className="text-primary font-bold">{provider.averageRating || 'New'}</span>
                                    <span className="text-sm opacity-60">({provider.reviewCount} reviews from Google)</span>
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
                                        <Button variant="outline" size="lg" className="h-14 px-8 border-primary/20 text-primary hover:bg-primary/5">
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
                                    {provider.ai_description ||
                                        (provider.top_reviews && provider.top_reviews[0]?.text
                                            ? `"${provider.top_reviews[0].text.substring(0, 200)}..."`
                                            : `${provider.name} is a premier ${provider.businessType} located in ${provider.city}. They specialize in providing high-quality aesthetic treatments tailored to individual patient goals.`)}
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
                                    {(provider.pricePerUnit || provider.enriched_attrs?.price_per_unit_botox) ? (
                                        <div className="flex justify-between items-center p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                                            <span className="font-bold text-primary">Botox Pricing</span>
                                            <span className="text-secondary font-black text-xl">{formatCurrency(Number(provider.pricePerUnit || provider.enriched_attrs?.price_per_unit_botox))}/unit</span>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="font-bold text-primary">Botox / Dysport</span>
                                            <span className="text-gray-500 font-bold">Pricing upon request</span>
                                        </div>
                                    )}

                                    {provider.enriched_attrs?.price_per_unit_dysport && (
                                        <div className="flex justify-between items-center p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                            <span className="font-bold text-primary">Dysport Pricing</span>
                                            <span className="text-blue-600 font-black text-xl">{formatCurrency(Number(provider.enriched_attrs.price_per_unit_dysport))}/unit</span>
                                        </div>
                                    )}

                                    {/* Services Offered Chips */}
                                    {provider.services_offered && provider.services_offered.length > 0 && (
                                        <div className="pt-4 pb-2">
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Expertise & Services</p>
                                            <div className="flex flex-wrap gap-2">
                                                {provider.services_offered.map((service: string, i: number) => (
                                                    <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-100">
                                                        {service}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Fallback if services_offered is empty */}
                                    {(!provider.services_offered || provider.services_offered.length === 0) && (!provider.pricePerUnit && !provider.enriched_attrs?.price_per_unit_botox) && (
                                        <div className="space-y-3 pt-4 border-t border-gray-50">
                                            <p className="text-sm text-gray-500 font-medium mb-2">Available Treatments:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {['Forehead Lines', "Crow's Feet", 'Frown Lines (Glabella)', 'Masseter (TMJ)', 'Lip Flip', 'Hyperhidrosis'].map(s => (
                                                    <span key={s} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 p-4 bg-primary/5 rounded-xl text-xs text-primary/70 leading-relaxed">
                                        <strong>Market Note:</strong> Typical {provider.city} pricing for Botox ranges from $12 to $16 per unit.
                                    </div>

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

                            {/* Gallery */}
                            {provider.gallery && provider.gallery.length > 0 && (
                                <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
                                    <h2 className="text-2xl font-display font-bold text-primary mb-6">Clinic Gallery</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {provider.gallery.map((url: string, i: number) => (
                                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                                                <img
                                                    src={url}
                                                    alt={`${provider.name} gallery image ${i + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                        city={provider.city}
                                        state={provider.state}
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
                                                <div className="text-sm font-semibold text-gray-700 leading-relaxed">
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
                                        <Link href={`/provider/claim?id=${provider.id}`} className="block">
                                            <Button className="w-full bg-secondary hover:bg-secondary/90 text-white border-0 py-6 text-md font-bold shadow-lg">
                                                Claim This Listing
                                            </Button>
                                        </Link>
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
