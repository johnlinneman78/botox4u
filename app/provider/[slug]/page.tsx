import Link from 'next/link'
import { ShieldCheck, Clock, ExternalLink, Shield, Award, Zap, Info, Heart, Gem, Target, DollarSign } from 'lucide-react'
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
import { JsonLd, generateMedicalClinicSchema, generateBreadcrumbSchema } from '@/components/seo/JsonLd'
import { NICHE } from '@/config/niche'

interface ProviderProfileProps {
    params: { slug: string }
}

export async function generateMetadata({ params }: ProviderProfileProps): Promise<Metadata> {
    const resolvedParams = await params
    const provider = await getProviderBySlug(resolvedParams.slug)

    if (!provider) return { title: 'Provider Not Found' }

    return {
        title: `${provider.name} | Natural Results & Pricing in ${provider.city} | ${NICHE.siteName}`,
        description: `Verified ${NICHE.providerType} ${provider.name} in ${provider.city}. The Botox-4U Index scores providers on natural results, independent pricing data, and federal credentials.`
    }
}

export default async function ProviderProfilePage({ params }: ProviderProfileProps) {
    const resolvedParams = await params
    const provider = await getProviderBySlug(resolvedParams.slug)

    if (!provider) {
        notFound()
    }

    const schema = generateMedicalClinicSchema(provider);
    const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: provider.city, item: `${NICHE.baseSlug}/${provider.state.toLowerCase()}/${provider.city.toLowerCase().replace(/ /g, '-')}` },
        { name: provider.name, item: `/provider/${provider.slug}` }
    ]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <JsonLd data={schema} />
            <JsonLd data={breadcrumbs} />
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
                                        Consult with Clinic
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
                                <h2 className="text-2xl font-display font-bold text-primary mb-6 text-balance">About the Clinic</h2>

                                {(provider.score_results_quality || 0) > 25 && (
                                    <div className="mb-6 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0">
                                            <Heart className="w-6 h-6 fill-white" />
                                        </div>
                                        <p className="text-rose-900 text-sm font-bold">
                                            Patient Favorite for Natural, Conservative Results
                                        </p>
                                    </div>
                                )}

                                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                                    {provider.ai_description ||
                                        (provider.top_reviews && provider.top_reviews[0]?.text
                                            ? `"${provider.top_reviews[0].text.substring(0, 200)}..."`
                                            : `${provider.name} is a premier ${provider.businessType} located in ${provider.city}. They specialize in providing high-quality aesthetic treatments tailored to individual patient goals.`)}
                                </p>

                                {/* NPI Credentials Integration */}
                                <div className="mt-8 pt-8 border-t border-gray-50">
                                    <h3 className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-6">Credential Verification</h3>

                                    {provider.npi_verified ? (
                                        <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 group transition-all hover:bg-blue-50">
                                            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <strong className="text-blue-900 text-lg">NPI Verified Record</strong>
                                                    <span className="px-2 py-0.5 bg-blue-600 text-[10px] text-white font-bold rounded uppercase tracking-tighter">Federal Registry</span>
                                                </div>
                                                <p className="text-blue-800/70 text-sm mb-4 leading-relaxed">
                                                    This provider holds a valid federal NPI registration as a <strong>{provider.npi_license_type || 'Medical Professional'}</strong>, specialized in <strong>{provider.npi_specialty || 'Aesthetic Medicine'}</strong>.
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <div className="text-[11px] font-bold text-blue-900/40 uppercase tracking-widest bg-white/50 px-2 py-1 rounded">NPI: {provider.npi_number}</div>
                                                    <a
                                                        href={`https://npiregistry.cms.hhs.gov/provider-view/${provider.npi_number}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                                                    >
                                                        View Federal Registry <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                    {provider.allergan_tier && provider.allergan_tier !== 'None' && (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-100 italic transition-transform hover:scale-105">
                                                            <Gem className="w-3.5 h-3.5" />
                                                            <span className="text-[11px] font-black uppercase tracking-tight">Allergan {provider.allergan_tier} Status</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-4 p-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-300 transition-all hover:border-gray-400">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 shadow-sm">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <strong className="text-gray-900">Verification Pending</strong>
                                                    <span className="px-2 py-0.5 bg-gray-200 text-[10px] text-gray-500 font-bold rounded uppercase tracking-tighter">In Queue</span>
                                                </div>
                                                <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                                                    We are currently auditing the medical registries for this location. We recommend asking for provider credentials during your initial consultation.
                                                </p>
                                            </div>
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
                                            <span className="font-bold text-primary">{NICHE.name} Pricing</span>
                                            <span className="text-secondary font-black text-xl">{formatCurrency(Number(provider.pricePerUnit || provider.enriched_attrs?.price_per_unit_botox))}/{NICHE.priceUnit.split(' ').slice(-1)}</span>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="font-bold text-primary">{NICHE.namePlural}</span>
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
                                        <strong>Market Note:</strong> Typical {provider.city} pricing for {NICHE.name} ranges from $12 to $16 {NICHE.priceUnit}.
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
                                {/* Audit Scorecard hidden for now as per user request */}
                                {/* 
                                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden group">
                                    ...
                                </div> 
                                */}

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

                    <div className="mt-12 p-6 bg-gray-100/50 rounded-2xl text-[10px] text-gray-500 italic leading-relaxed border border-gray-200">
                        {NICHE.copy.footerDisclaimer}
                    </div>
                </div>
            </section>
        </div>
    )
}
