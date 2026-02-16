import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { getProviderBySlug } from '@/lib/actions/providers'
import { LeadForm } from '@/components/providers/LeadForm'
import { notFound } from 'next/navigation'

export default async function ProviderProfilePage({ params }: { params: { slug: string } }) {
    const provider = await getProviderBySlug(params.slug)

    if (!provider) {
        notFound()
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Profile Header */}
            <section className="bg-white border-b border-gray-200 pt-12 pb-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Logo/Photo Placeholder */}
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-primary/5 rounded-2xl flex items-center justify-center border-2 border-gray-100 relative overflow-hidden shrink-0">
                            <span className="text-5xl">🏥</span>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
                                    {provider.name}
                                </h1>
                                {provider.verified && <Badge variant="verified">VERIFIED PROVIDER</Badge>}
                                {provider.listing_tier === 'premium' && <Badge variant="premium">PREMIUM LISTING</Badge>}
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                                <div className="flex items-center gap-1">
                                    <span className="text-accent font-bold">★</span>
                                    <span className="font-bold text-primary">{Number(provider.average_rating)}</span>
                                    <span>({provider.review_count} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>📍 {provider.city}, {provider.state}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>💼 {provider.business_type}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <a href="#quote-form">
                                    <Button variant="primary" size="lg" className="px-8 shadow-lg shadow-secondary/20">
                                        Get a Quote
                                    </Button>
                                </a>
                                {provider.website && (
                                    <a href={provider.website} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="lg">Visit Website</Button>
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
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-2/3 space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>About This Provider</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        {provider.description || "The provider has not yet added a description. Contact them directly to learn more about their services."}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {provider.credentials && Array.isArray(provider.credentials) && provider.credentials.map((cred: string, i: number) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                                <span className="text-success">✔</span> {cred}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Services & Estimated Pricing</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="divide-y divide-gray-100">
                                        {provider.price_per_unit && (
                                            <div className="py-4 flex justify-between items-center">
                                                <span className="font-medium text-gray-900">Price Per Unit</span>
                                                <span className="text-secondary font-bold">{formatCurrency(Number(provider.price_per_unit))}/unit</span>
                                            </div>
                                        )}
                                        {provider.services_offered && Array.isArray(provider.services_offered) && provider.services_offered.map((service: any, i: number) => (
                                            <div key={i} className="py-4 flex justify-between items-center">
                                                <span className="font-medium text-gray-900">{service.name}</span>
                                                <span className="text-secondary font-bold">{service.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-4 italic">
                                        *Prices are estimates based on local averages or provider-supplied data. Final cost determined at consultation.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Patient Reviews</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        {provider.reviews && provider.reviews.length > 0 ? (
                                            provider.reviews.map((review: any, i: number) => (
                                                <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-primary">{review.author_name}</span>
                                                            <span className="text-accent">{'★'.repeat(review.rating)}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {review.content}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No reviews yet for this provider.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:w-1/3 space-y-8">
                            <Card className="bg-primary text-white border-none shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-white text-xl">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {provider.phone && (
                                        <div className="flex items-start gap-3">
                                            <span className="text-secondary text-xl">📱</span>
                                            <div>
                                                <div className="text-white/60 text-xs mb-1 uppercase tracking-wider">Phone</div>
                                                <div className="text-lg font-bold">{provider.phone}</div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <span className="text-secondary text-xl">🏠</span>
                                        <div>
                                            <div className="text-white/60 text-xs mb-1 uppercase tracking-wider">Address</div>
                                            <div className="text-sm">{provider.address}</div>
                                            <div className="text-sm">{provider.city}, {provider.state} {provider.zip_code}</div>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6">
                                        Get Directions
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Advanced Lead Form Widget */}
                            <div id="quote-form" className="sticky top-24">
                                <LeadForm providerId={provider.id} providerName={provider.name} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
