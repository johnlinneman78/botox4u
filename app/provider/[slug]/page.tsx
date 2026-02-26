import Link from 'next/link'
import { ShieldCheck, Clock, ExternalLink, Shield, Award, Zap, Info, Heart, Gem, Target, DollarSign, Dna, Cpu } from 'lucide-react'
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
import { JsonLd, generateMedicalClinicSchema, generateBreadcrumbSchema, generateReviewSchema } from '@/components/seo/JsonLd'
import { NICHE } from '@/config/niche'

interface ProviderProfileProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProviderProfileProps): Promise<Metadata> {
    const resolvedParams = await params
    const provider = await getProviderBySlug(resolvedParams.slug)

    if (!provider) return { title: 'Provider Not Found' }

    return {
        title: `${provider.name} | TrueScore™ & Pricing in ${provider.city} | ${NICHE.siteName}`,
        description: `Compare ${provider.name} in ${provider.city} using TrueScore™ — independent data on injection quality, credentials, and real pricing. See how they rank vs. the market.`,
        alternates: {
            canonical: `https://www.injectorindex.com/provider/${provider.slug}`,
        },
        robots: {
            index: true,
            follow: true,
        }
    }
}

export default async function ProviderProfilePage({ params }: ProviderProfileProps) {
    const resolvedParams = await params
    const provider = await getProviderBySlug(resolvedParams.slug)

    if (!provider) {
        notFound()
    }

    const schema = generateMedicalClinicSchema(provider);
    const reviewSchema = generateReviewSchema(provider);
    const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: provider.city, item: `/${NICHE.baseSlug}/${provider.state.toLowerCase()}/${provider.city.toLowerCase().replace(/ /g, '-')}` },
        { name: provider.name, item: `/provider/${provider.slug}` }
    ]);

    return (
        <div className="bg-[#0d1420] min-h-screen">
            <JsonLd data={schema} />
            <JsonLd data={reviewSchema} />
            <JsonLd data={breadcrumbs} />

            {/* Claim Banner for Unclaimed Profiles */}
            {!provider.verified && (
                <div className="bg-[#d4af37]/10 border-b border-[#d4af37]/20 py-3">
                    <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-[#d4af37]">
                            <Zap className="w-5 h-5 fill-[#d4af37]" />
                            <p className="text-sm md:text-base font-bold">
                                Is this your practice? <span className="font-medium opacity-80">Claim your free profile to add pricing and unlock your verified badge.</span>
                            </p>
                        </div>
                        <Link href={`/claim/${provider.slug}`}>
                            <Button size="sm" className="bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] font-black rounded-full px-6 whitespace-nowrap">
                                Claim — It's Free
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Hero Image Section */}
            <section className="relative h-[300px] md:h-[450px] w-full overflow-hidden">
                <img
                    src={provider.hero_image_url || provider.imageUrl || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1600"}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1420] via-[#0d1420]/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full pb-8">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl">
                            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-3">
                                {provider.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm md:text-base font-medium">
                                <span className="flex items-center gap-1">📍 {provider.city}, {provider.state}</span>
                                <span className="w-1 h-1 rounded-full bg-white/40"></span>
                                <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
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

            {/* Profile Header */}
            <section className="relative bg-[#101827] pt-12 pb-8 border-b border-white/[0.05]">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        {/* Logo/Photo */}
                        <div className="w-40 h-40 bg-white/[0.03] rounded-3xl flex items-center justify-center border border-white/[0.08] shadow-2xl relative overflow-hidden shrink-0 group">
                            {provider.imageUrl && !provider.imageUrl.includes('placeholder') && provider.imageUrl.length > 5 ? (
                                <img src={provider.imageUrl} alt={provider.name} className="w-full h-full object-cover" />
                            ) : (
                                <img
                                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
                                    alt="Default Clinic"
                                    className="w-full h-full object-cover opacity-40"
                                />
                            )}
                            {provider.listingTier === 'premium' && (
                                <div className="absolute -bottom-2 -right-2 bg-[#d4af37] text-[#0d1420] p-2 text-xl rounded-full shadow-lg border-2 border-[#0d1420]">
                                    ★
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
                                <div className="text-2xl font-display font-bold text-white">
                                    Clinic Profile
                                </div>
                                {provider.verified || provider.listingTier === 'verified' || provider.listingTier === 'featured' ? (
                                    <Badge variant="verified" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                        VERIFIED
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-gray-600 border-gray-700">
                                        UNVERIFIED
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-gray-500 mb-8 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[#d4af37] text-lg">★</span>
                                    <span className="text-white font-bold">{provider.averageRating || 'New'}</span>
                                    <span className="text-sm opacity-60">({provider.reviewCount} reviews from Google)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[#d4af37] opacity-60">📍</span>
                                    <span>{provider.city}, {provider.state}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[#d4af37] opacity-60">💼</span>
                                    <span>{provider.businessType}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <a href="#quote-form">
                                    <Button variant="primary" size="lg" className="px-10 h-14 text-lg bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] shadow-xl shadow-[#d4af37]/20 font-black">
                                        Consult with Clinic
                                    </Button>
                                </a>
                                {provider.website && (
                                    <a href={provider.website} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="lg" className="h-14 px-8 border-white/10 text-gray-400 hover:bg-white/5">
                                            Official Website
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="lg:w-2/3 space-y-8">
                            {/* About */}
                            <div className="bg-white/[0.02] p-8 md:p-10 rounded-3xl border border-white/[0.06]">
                                <h2 className="text-2xl font-display font-bold text-white mb-6 text-balance">About the Clinic</h2>

                                {(provider.score_results_quality || 0) > 25 && (
                                    <div className="mb-6 p-4 bg-emerald-950/30 rounded-2xl border border-emerald-800/30 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                            <Heart className="w-6 h-6 fill-emerald-400" />
                                        </div>
                                        <p className="text-emerald-400 text-sm font-bold">
                                            Patient Favorite for Natural, Conservative Results
                                        </p>
                                    </div>
                                )}

                                <p className="text-gray-400 leading-relaxed text-lg mb-8">
                                    {provider.ai_description ||
                                        (provider.top_reviews && provider.top_reviews[0]?.text
                                            ? `"${provider.top_reviews[0].text.substring(0, 200)}..."`
                                            : `${provider.name} is a premier ${provider.businessType} located in ${provider.city}. They specialize in providing high-quality aesthetic treatments tailored to individual patient goals.`)}
                                </p>

                                {/* NPI Credentials */}
                                <div className="mt-8 pt-8 border-t border-white/[0.05]">
                                    <h3 className="text-xs font-black text-[#d4af37] uppercase tracking-[0.2em] mb-6">Credential Verification</h3>

                                    {provider.npi_verified ? (
                                        <div className="flex items-start gap-4 p-6 bg-blue-950/30 rounded-2xl border border-blue-800/30 group transition-all hover:bg-blue-950/40">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <strong className="text-blue-300 text-lg">NPI Verified Record</strong>
                                                    <span className="px-2 py-0.5 bg-blue-500/20 text-[10px] text-blue-400 font-bold rounded uppercase tracking-tighter border border-blue-500/30">Federal Registry</span>
                                                </div>
                                                <p className="text-blue-300/60 text-sm mb-4 leading-relaxed">
                                                    This provider holds a valid federal NPI registration as a <strong className="text-blue-300">{provider.npi_license_type || 'Medical Professional'}</strong>, specialized in <strong className="text-blue-300">{provider.npi_specialty || 'Aesthetic Medicine'}</strong>.
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <div className="text-[11px] font-bold text-blue-400/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">NPI: {provider.npi_number}</div>
                                                    <a
                                                        href={`https://npiregistry.cms.hhs.gov/provider-view/${provider.npi_number}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                                                    >
                                                        View Federal Registry <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                    {provider.allergan_tier && provider.allergan_tier !== 'None' && (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-950/30 text-violet-400 rounded-lg border border-violet-800/30 italic transition-transform hover:scale-105">
                                                            <Gem className="w-3.5 h-3.5" />
                                                            <span className="text-[11px] font-black uppercase tracking-tight">Allergan {provider.allergan_tier} Status</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-4 p-6 bg-white/[0.02] rounded-2xl border border-dashed border-gray-700 transition-all hover:border-gray-600">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 shrink-0">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <strong className="text-white">Verification Pending</strong>
                                                    <span className="px-2 py-0.5 bg-white/5 text-[10px] text-gray-500 font-bold rounded uppercase tracking-tighter border border-white/10">In Queue</span>
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                                                    We are currently auditing the medical registries for this location. We recommend asking for provider credentials during your initial consultation.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Services */}
                            <div className="bg-white/[0.02] p-8 md:p-10 rounded-3xl border border-white/[0.06]">
                                <h2 className="text-2xl font-display font-bold text-white mb-6">Services & Pricing</h2>
                                <div className="space-y-4">
                                    {(provider.pricePerUnit || provider.enriched_attrs?.price_per_unit_botox) && (provider.listingTier === 'featured' || provider.listingTier === 'verified') ? (
                                        <div className="flex justify-between items-center p-4 bg-[#d4af37]/5 rounded-xl border border-[#d4af37]/15">
                                            <span className="font-bold text-white">{NICHE.name} Pricing</span>
                                            <span className="text-[#d4af37] font-black text-xl">{formatCurrency(Number(provider.pricePerUnit || provider.enriched_attrs?.price_per_unit_botox))}/{NICHE.priceUnit.split(' ').slice(-1)}</span>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                                            <span className="font-bold text-white">{NICHE.namePlural}</span>
                                            <span className="text-gray-600 font-bold italic">Not Listed</span>
                                        </div>
                                    )}

                                    {provider.enriched_attrs?.price_per_unit_dysport && (
                                        <div className="flex justify-between items-center p-4 bg-blue-950/30 rounded-xl border border-blue-800/30">
                                            <span className="font-bold text-white">Dysport Pricing</span>
                                            <span className="text-blue-400 font-black text-xl">{formatCurrency(Number(provider.enriched_attrs.price_per_unit_dysport))}/unit</span>
                                        </div>
                                    )}

                                    {provider.services_offered && provider.services_offered.length > 0 && (
                                        <div className="pt-4 pb-2">
                                            <p className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-4">Expertise & Services</p>
                                            <div className="flex flex-wrap gap-2">
                                                {provider.services_offered.map((service: string, i: number) => (
                                                    <span key={i} className="px-3 py-1.5 bg-white/5 text-gray-400 text-xs font-bold rounded-lg border border-white/10">
                                                        {service}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(!provider.services_offered || provider.services_offered.length === 0) && (!provider.pricePerUnit && !provider.enriched_attrs?.price_per_unit_botox) && (
                                        <div className="space-y-3 pt-4 border-t border-white/[0.05]">
                                            <p className="text-sm text-gray-500 font-medium mb-2">Available Treatments:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {['Forehead Lines', "Crow's Feet", 'Frown Lines (Glabella)', 'Masseter (TMJ)', 'Lip Flip', 'Hyperhidrosis'].map(s => (
                                                    <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gray-500">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 p-4 bg-white/[0.02] rounded-xl text-xs text-gray-600 leading-relaxed border border-white/[0.04]">
                                        <strong className="text-gray-400">Market Note:</strong> Typical {provider.city} pricing for {NICHE.name} ranges from $12 to $16 {NICHE.priceUnit}.
                                    </div>

                                    {provider.enriched_attrs?.new_patient_special && (
                                        <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-800/30 text-emerald-400 font-medium">
                                            🎁 <span className="font-bold">New Patient Special:</span> {provider.enriched_attrs.new_patient_special}
                                        </div>
                                    )}
                                </div>
                                <p className="text-[11px] text-gray-700 mt-6 italic bg-white/[0.02] p-3 rounded-lg text-center border border-white/[0.04]">
                                    Note: Final treatment costs vary by patient. A formal consultation is required for exact pricing.
                                </p>
                            </div>

                            {/* Gallery */}
                            {provider.gallery && provider.gallery.length > 0 && (
                                <div className="bg-white/[0.02] p-8 md:p-10 rounded-3xl border border-white/[0.06]">
                                    <h2 className="text-2xl font-display font-bold text-white mb-6">Clinic Gallery</h2>
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
                            <div className="bg-white/[0.02] p-8 md:p-10 rounded-3xl border border-white/[0.06]">
                                <ReviewCarousel
                                    reviews={provider.top_reviews || provider.reviews || []}
                                    totalReviews={provider.reviewCount || 0}
                                    googlePlaceId={provider.google_place_id || ''}
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3">
                            <div className="sticky top-24 space-y-6">
                                {/* TrueScore™ Card */}
                                <div className="bg-gradient-to-br from-[#d4af37]/10 to-[#0d1420] p-8 rounded-[2rem] border border-[#d4af37]/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                                            <span className="text-xs font-black text-[#d4af37] uppercase tracking-widest">TrueScore™</span>
                                        </div>

                                        {/* Score Visual */}
                                        <div className="flex items-end gap-3 mb-4">
                                            <div className="text-5xl font-black font-display text-white">{provider.score_total || 50}</div>
                                            <div className="text-sm text-[#d4af37] font-black pb-2 uppercase tracking-tight">/ 100</div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#d4af37] to-[#f4d06f] rounded-full transition-all"
                                                style={{ width: `${provider.score_total || 50}%` }}
                                            ></div>
                                        </div>

                                        {/* Internal Pillars */}
                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-gray-500 uppercase tracking-widest">Injection Quality</span>
                                                <span className="text-white">{(provider.score?.breakdown?.injectionQuality || 0)}/40</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-gray-500 uppercase tracking-widest">Provider Credentials</span>
                                                <span className="text-white">{(provider.score?.breakdown?.credentials || 0)}/25</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-gray-500 uppercase tracking-widest">Innovation Adoption</span>
                                                <span className="text-white">{(provider.score?.breakdown?.innovation || 0)}/20</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-gray-500 uppercase tracking-widest">Treatment Range</span>
                                                <span className="text-white">{(provider.score?.breakdown?.treatmentRange || 0)}/15</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-500 text-[10px] leading-relaxed italic border-t border-white/5 pt-4">
                                            TrueScore™ is an independent dataset that scores clinics based on credentialing, price transparency, and menu innovation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                    <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/[0.06]">
                        <h3 className="text-xl font-display font-bold text-white mb-6">Clinic Info</h3>
                        <div className="space-y-4">
                            {provider.phone && (
                                <div className="flex items-start gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
                                    <span className="text-2xl">📱</span>
                                    <div>
                                        <div className="text-xs text-gray-600 font-bold uppercase mb-0.5">Phone</div>
                                        <a href={`tel:${provider.phone}`} className="text-lg font-bold text-white hover:text-[#d4af37] transition-colors">
                                            {provider.phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
                                <span className="text-2xl">🏠</span>
                                <div>
                                    <div className="text-xs text-gray-600 font-bold uppercase mb-0.5">Location</div>
                                    <div className="text-sm font-semibold text-gray-400 leading-relaxed">
                                        {provider.address}<br />
                                        {provider.city}, {provider.state}
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 text-gray-400 hover:bg-white/5">
                                Get Directions
                            </Button>
                        </div>
                    </div>

                </div>
            </section>

            <div className="container mx-auto px-4 pb-12">
                <div className="mt-12 p-6 bg-white/[0.02] rounded-2xl text-[10px] text-gray-700 italic leading-relaxed border border-white/[0.04]">
                    {NICHE.copy.footerDisclaimer || "Disclaimer: Information is provided for educational purposes only. Always consult a medical professional."}
                </div>
            </div>
        </div>
    )
}
