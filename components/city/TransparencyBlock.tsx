import { ShieldCheck, Eye, Lock } from 'lucide-react'
import Logo from '@/components/layout/Logo'
import { NICHE } from '@/config/niche'

export function TransparencyBlock({ city }: { city?: string }) {
    return (
        <section className="bg-white py-24 border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="bg-gray-50 rounded-[3rem] p-8 md:p-16 border border-gray-200 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[120px] rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full -ml-32 -mb-32"></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-10 w-auto">
                                    <Logo variant="shield" className="h-full" />
                                </div>
                                <div className="h-6 w-[1px] bg-gray-200"></div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-bold">
                                    <ShieldCheck className="w-4 h-4" />
                                    TRANSPARENCY FIRST
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary mb-8 leading-tight">
                                Natural Results. <br />Transparent Prices.
                            </h2>
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light">
                                40% of Botox patients fear looking &quot;overdone&quot; or &quot;frozen.&quot; We built {NICHE.siteName} to help you find the injectors who prioritize conservative, natural results — while showing you exactly what they charge before you walk in.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                        <Eye className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-sm text-primary">Real Pricing Scraped Daily</span>
                                </div>
                                <div className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-sm text-primary">NPI Registry Audited</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1a2332] p-10 md:p-14 rounded-[3rem] text-white shadow-2xl shadow-primary/20 relative">
                            <blockquote className="relative italic text-xl md:text-2xl font-light leading-relaxed mb-10 opacity-90">
                                &quot;Patients weren&apos;t just looking for the cheapest injector. They were looking for someone they could trust not to overdo it. So I built this score to reward natural results first.&quot;
                            </blockquote>
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-secondary shrink-0 shadow-lg">
                                    <img
                                        src="/images/founder.jpg"
                                        alt="John Linneman"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{NICHE.outreach.senderName}</div>
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
