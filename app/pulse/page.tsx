
import { Metadata } from 'next'
import { Brain, Database, LineChart, ShieldCheck, Star, Users, MapPin, DollarSign, Stethoscope, Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
    title: 'The Botox Pulse | Live Pricing & Results Survey',
    description: 'Contribute to the largest independent Botox pricing index. Share your per-unit cost and patient experience to help others find fair, high-quality care.',
}

export default function PulsePage() {
    return (
        <main className="min-h-screen bg-[#0d1420]">
            {/* Premium Hero */}
            <section className="relative overflow-hidden bg-[#1a2332] py-24 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] via-[#151b26] to-[#0f141c]" />
                <div className="absolute inset-0 opacity-[0.05]" style={{
                    backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary opacity-10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 text-secondary px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-10 backdrop-blur-md">
                        <LineChart className="w-4 h-4" />
                        Live Market Intel
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-[1.05]">
                        The <span className="text-secondary italic">Pulse</span> Survey
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                        Help us build the most transparent pricing index in aesthetic medicine. Join 2,400+ patients tracking real-time costs and results.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-white mt-16 pt-12 border-t border-white/10">
                        <div>
                            <div className="text-3xl font-bold font-display mb-1">$14.22</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global Avg / Unit</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold font-display mb-1">32</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Cities Tracked</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold font-display mb-1">2,324</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verified Providers</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold font-display mb-1">100%</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Independent Data</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Survey Intro */}
            <section className="py-24 bg-[#0d1420]">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl font-display font-bold text-white mb-8 leading-tight">
                                Your data protects <span className="text-[#d4af37]">other patients.</span>
                            </h2>
                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                                        <Database className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">Expose Hidden Pricing</h4>
                                        <p className="text-gray-500 font-light leading-relaxed">By sharing what you paid, you help highlight practices with fair, transparent pricing models.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">Verify Injector Claims</h4>
                                        <p className="text-gray-500 font-light leading-relaxed">Real patient-reported outcomes are the only way to verify if a clinic's "natural results" match reality.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                                        <Brain className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2">Crowdsourced Intelligence</h4>
                                        <p className="text-gray-500 font-light leading-relaxed">No single agent can index everything. Your individual experience is the key to our collective intelligence.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* The Form */}
                        <div id="survey" className="bg-[#101827] border border-white/[0.06] p-8 md:p-12 rounded-[3.5rem] shadow-xl">
                            <div className="flex justify-between items-center mb-10">
                                <div className="h-1 flex-1 bg-white/[0.06] rounded-full overflow-hidden mr-4">
                                    <div className="w-1/3 h-full bg-[#d4af37]" />
                                </div>
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest whitespace-nowrap">Step 1 of 4</span>
                            </div>

                            <form className="space-y-8">
                                {/* Location */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#d4af37]" />
                                        Where was your treatment?
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="City, State"
                                        className="w-full h-16 px-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#d4af37]/10 text-lg text-white transition-all placeholder:text-gray-600"
                                    />
                                </div>

                                {/* Per Unit Cost */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-[#d4af37]" />
                                        What did you pay per unit?
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                                        <input
                                            type="number"
                                            placeholder="e.g. 14"
                                            className="w-full h-16 pl-10 pr-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#d4af37]/10 text-lg text-white transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>

                                {/* Injector */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                        <Stethoscope className="w-4 h-4 text-[#d4af37]" />
                                        Who was your injector?
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Clinic or Provider Name"
                                        className="w-full h-16 px-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#d4af37]/10 text-lg text-white transition-all placeholder:text-gray-600"
                                    />
                                </div>

                                {/* Results Satisfaction */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                        <Heart className="w-4 h-4 text-[#d4af37]" />
                                        How satisfied were you?
                                    </label>
                                    <div className="flex gap-3">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                className="flex-1 h-14 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-[#d4af37] hover:text-[#d4af37] text-gray-500 flex items-center justify-center transition-all group"
                                            >
                                                <Star className="w-5 h-5 group-hover:fill-[#d4af37]" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button className="w-full h-18 bg-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] font-bold text-xl py-6 rounded-3xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                                    Submit Local Data
                                    <ArrowRight className="w-6 h-6" />
                                </Button>

                                <p className="text-[10px] text-gray-400 text-center font-light leading-relaxed px-8">
                                    Your specific pricing data will be anonymized and aggregated into our city indexes. We will never share your personal information with clinics.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Weights Section */}
            <section className="py-24 bg-white/[0.02] border-t border-white/[0.06]">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-16">
                        <h3 className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.4em] mb-4">The Secret Sauce</h3>
                        <h2 className="text-4xl font-display font-bold text-white mb-6">Audited by II-Priority™</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed italic">
                            Unlike other directories, we don't sell top spots. Rankings are hardcoded by a three-pillar audit focused on patient outcomes over marketing spend.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-[2.5rem] bg-[#101827] border border-white/[0.06] relative overflow-hidden group">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Clinical Integrity</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Our baseline safety audit includes NPI verification and a rigorous cross-reference of historical patient outcomes and medical licensure.
                            </p>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-[#101827] border border-white/[0.06] relative overflow-hidden group">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">The Regen-Ratio™</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                We mathematically prioritize "Artisan" clinics focused on skin health and biostimulation over high-volume, generic filler-only practices.
                            </p>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-[#101827] border border-white/[0.06] relative overflow-hidden group">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Artisan Granularity</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Our proprietary algorithm gives visibility to independent specialist practitioners who maintain a higher standard of tailored clinical care.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 p-6 rounded-2xl bg-red-950/20 border border-red-900/30 flex items-center justify-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Specialist Audit Active:</span>
                        <p className="text-[10px] text-gray-500">Providers who do not meet our proprietary Safety Floor requirements are relegated to our general index.</p>
                    </div>
                </div>
            </section>

            {/* Pulse Proof Section */}
            <section className="py-24 bg-[#101827] border-y border-white/[0.06]">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-xl font-bold text-white mb-16 uppercase tracking-[0.2em]">Verified Community Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-left">
                            <div className="text-secondary mb-4 flex">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-secondary" />)}
                            </div>
                            <p className="text-gray-500 italic mb-6">"I thought $22/unit was normal for the Pearl District. After seeing the Pulse data, I realized I was overpaying by $400 per visit. Found a new injector 2 miles away with more experience."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/[0.06]" />
                                <div>
                                    <div className="text-sm font-bold text-white">Sarah J.</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">New York, NY</div>
                                </div>
                            </div>
                        </div>
                        <div className="text-left">
                            <div className="text-secondary mb-4 flex">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-secondary" />)}
                            </div>
                            <p className="text-gray-500 italic mb-6">"The 'Natural Results' signal actually works. My previous place made me look frozen. I used the index to find someone focused on conservative treatments and couldn't be happier."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/[0.06]" />
                                <div>
                                    <div className="text-sm font-bold text-white">Elena M.</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Scottsdale, AZ</div>
                                </div>
                            </div>
                        </div>
                        <div className="text-left">
                            <div className="text-secondary mb-4 flex">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-secondary" />)}
                            </div>
                            <p className="text-gray-500 italic mb-6">"Being able to see the NPI verification before booking gave me peace of mind after hearing about some of the unlicensed spa issues recently. Data matters."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/[0.06]" />
                                <div>
                                    <div className="text-sm font-bold text-white">Marcus K.</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Dallas, TX</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
