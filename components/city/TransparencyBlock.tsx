import { ShieldCheck, Eye, Lock } from 'lucide-react'
import Logo from '@/components/layout/Logo'
import { NICHE } from '@/config/niche'

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
                                Because what&apos;s in the needle matters.
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Aesthetic treatments are a big decision and a significant investment. <strong>You deserve a defense.</strong> We show real {NICHE.priceUnit} pricing and verified {NICHE.providerType} credentials so you don&apos;t have to fly blind.
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

                        <div className="bg-[#1a2332] p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative">
                            <blockquote className="relative italic text-xl md:text-2xl font-light leading-relaxed mb-8">
                                &quot;In an industry where patients often pay for the clinic&apos;s massive overhead, we built {NICHE.siteName} to help you find the actual value and safety you deserve.&quot;
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary shrink-0">
                                    <img
                                        src="/images/founder.jpg"
                                        alt="John Linneman"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-bold">{NICHE.outreach.senderName}</div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{NICHE.outreach.senderTitle}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
