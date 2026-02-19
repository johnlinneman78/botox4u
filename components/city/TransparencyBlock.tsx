import { ShieldCheck, Eye, Lock } from 'lucide-react'
import Logo from '@/components/layout/Logo'

export function TransparencyBlock({ city }: { city?: string }) {
    return (
        <section className="bg-white py-12 border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[120px] rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full -ml-32 -mb-32"></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-auto">
                                    <Logo variant="shield" className="h-full" />
                                </div>
                                <div className="h-6 w-[1px] bg-gray-200"></div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-bold">
                                    <ShieldCheck className="w-4 h-4" />
                                    TRANSPARENCY FIRST
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6 leading-tight">
                                Why us vs. Yelp, Google, or RealSelf?
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                We show <strong>real per-unit pricing</strong> and <strong>verified injector qualifications</strong> for Botox and Dysport {city ? `in ${city}` : 'nationwide'}. No pay-to-play rankings; providers can&apos;t hide their pricing or pay to suppress negative data.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                        <Eye className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm">Real Pricing Scraped Daily</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm">Verified Credentials Only</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative">
                            <blockquote className="relative italic text-xl md:text-2xl font-light leading-relaxed mb-8">
                                &quot;In an industry known for opaque pricing and 'hidden' costs, we built Botox-4u.com to bring actual transparency to aesthetic medicine.&quot;
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-black text-white">JL</div>
                                <div>
                                    <div className="font-bold">John Linneman</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Founder, Botox-4u.com</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
