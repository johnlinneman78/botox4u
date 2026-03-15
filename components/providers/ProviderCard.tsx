import Link from 'next/link'
import { CheckCircle, MapPin, Star, Trophy, Calendar, Info, ShieldCheck, User, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ProviderCardProps {
    provider: {
        id: string
        name: string
        slug: string
        businessType: string
        address?: string
        city: string
        state: string
        averageRating: number
        reviewCount: number
        listingTier: 'free' | 'featured' | 'premium'
        verified: boolean
        pricePerUnit?: number
        minTreatmentPrice?: number
        imageUrl?: string
        enriched_attrs?: any
        website?: string
        description?: string
        lat?: number
        lng?: number
        clarityScore?: number
        score_total?: number
        practitioners?: any[]
    }
}

export function ProviderCard({ provider }: ProviderCardProps) {
    const isPremium = provider.listingTier === 'premium'

    // Lead Practitioner logic
    const leadPractitioner = provider.practitioners && provider.practitioners.length > 0
        ? provider.practitioners[0]
        : null;

    let experienceYears = 0;
    let licenseYear = 0;
    if (leadPractitioner?.npi_enumeration_date) {
        licenseYear = new Date(leadPractitioner.npi_enumeration_date).getFullYear();
        experienceYears = new Date().getFullYear() - licenseYear;
    }

    const score = provider.clarityScore || provider.score_total || 85; // Default score if none present

    // Treatments mock logic based on enriched_attrs
    const treatments = [];
    if (provider.enriched_attrs?.price_per_unit_botox || provider.pricePerUnit) treatments.push('Botox');
    if (provider.enriched_attrs?.price_per_unit_dysport) treatments.push('Dysport');
    if (provider.enriched_attrs?.offers_lip_flip) treatments.push('Lip Filler');
    if (treatments.length === 0) treatments.push('Aesthetics', 'Injectables');

    const ctaText = leadPractitioner
        ? `${leadPractitioner.name} — ${provider.city}, ${provider.state}`
        : `${provider.name} — ${provider.city}, ${provider.state}`;

    return (
        <div className={`group relative w-full rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden flex flex-col ${isPremium ? 'border-[#C9A96E]/30 bg-white ring-1 ring-[#C9A96E]/20 shadow-lg' : 'bg-white border-[#3D2B1F]/10'}`}>
            <div className="p-6 md:p-8 flex flex-col flex-1">

                {/* Row 1: Business identity + score */}
                <div className="flex justify-between items-start mb-6 border-b border-[#3D2B1F]/10 pb-6">
                    <div>
                        <h3 className="text-[20px] font-display font-medium text-[#3D2B1F] leading-tight mb-1 group-hover:text-[#C9A96E] transition-colors">
                            {provider.name}
                        </h3>
                        <p className="font-sans text-[12px] text-[#A89B8C]">
                            {provider.businessType || 'Aesthetic Clinic'} · {provider.city}, {provider.state}
                        </p>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="flex flex-col items-center">
                            <span className="text-[20px] font-display font-bold text-[#3D2B1F] leading-none mb-0.5">{score}/100</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A96E] flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                Clarity
                            </span>
                        </div>
                    </div>
                </div>

                {/* Row 2: Lead practitioner credentials */}
                <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#3D2B1F]/40 mb-3">Lead Practitioner</p>

                    {leadPractitioner ? (
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#3D2B1F]/10 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-[#3D2B1F]/40" />
                            </div>
                            <div>
                                <h4 className="font-sans font-medium text-[15px] text-[#3D2B1F] mb-0.5">
                                    {leadPractitioner.name}{leadPractitioner.credentials ? `, ${leadPractitioner.credentials}` : ''}
                                </h4>
                                <div className="flex items-center gap-1.5 font-sans text-[13px] text-[#A89B8C] mb-1">
                                    <span>{leadPractitioner.taxonomy || 'Aesthetics'}</span>
                                    {leadPractitioner.is_npi_verified && (
                                        <>
                                            <span className="opacity-50">·</span>
                                            <span className="text-[#8A9E8D] font-medium flex items-center gap-1">
                                                NPI Verified <CheckCircle className="w-3.5 h-3.5" />
                                            </span>
                                        </>
                                    )}
                                </div>
                                {licenseYear > 0 && (
                                    <p className="font-sans text-[13px] text-[#A89B8C] italic">
                                        Licensed since {licenseYear} · {experienceYears} years experience
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#3D2B1F]/5 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-[#3D2B1F]/20" />
                            </div>
                            <div className="flex items-center h-10">
                                <p className="font-sans text-[13px] text-[#A89B8C] italic">Credentials pending verification</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Row 3: Treatment tags */}
                <div className="mb-6 border-t border-[#3D2B1F]/10 pt-6">
                    <div className="flex flex-wrap gap-2">
                        {treatments.map((tag, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-[#F2EDE4] text-[#3D2B1F] text-[12px] font-sans rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-auto" />

                {/* Row 4: Rating + pricing */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[var(--color-gold)] text-[14px]">
                            {'★'.repeat(Math.round(provider.averageRating || 5))}
                        </span>
                        <span className="font-sans font-bold text-[14px] text-[#3D2B1F]">
                            {(provider.averageRating || 5.0).toFixed(1)}
                        </span>
                        <span className="font-sans text-[13px] text-[#A89B8C] ml-1">
                            ({provider.reviewCount || 0} reviews)
                        </span>
                    </div>

                    {provider.pricePerUnit && (
                        <div className="font-sans font-medium text-[14px] text-[#3D2B1F]">
                            From {formatCurrency(provider.pricePerUnit)}/unit
                        </div>
                    )}
                </div>

                {/* Row 5: CTA */}
                <div className="border-t border-[#3D2B1F]/10 pt-4 mt-2">
                    <Link href={`/provider/${provider.slug}`} className="flex justify-between items-center group/cta w-full">
                        <span className="font-sans font-medium text-[14px] text-[#3D2B1F]">
                            {ctaText}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#3D2B1F] opacity-40 group-hover/cta:opacity-100 group-hover/cta:translate-x-1 transition-all" />
                    </Link>
                </div>
            </div>

            <Link href={`/provider/${provider.slug}`} className="absolute inset-0 z-10 focus:outline-none" aria-label={`View details for ${provider.name}`} />
        </div>
    )
}
