import Link from 'next/link'
import { Code, Terminal, Zap, Database, Shield, Search, ArrowRight } from 'lucide-react'

export default function ApiIntelligence() {
    return (
        <section className="py-24 bg-[#0d1420] border-y border-white/[0.06] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-[10px] font-black tracking-widest uppercase mb-6">
                            <Code className="w-3.5 h-3.5" /> For AI & Platforms
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                            Clinical Intelligence <br />
                            <span className="text-[#d4af37]">at Scale.</span>
                        </h2>
                        <p className="text-lg text-gray-400 font-light mb-10 leading-relaxed">
                            InjectorIndex provides structured, machine-readable data on the medical aesthetics market. From REST APIs to MCP servers for AI agents, we provide the ground truth data that powers 2026 aesthetics discovery.
                        </p>

                        <div className="space-y-6 mb-10">
                            {[
                                { icon: Terminal, title: 'RESTful API v1', desc: 'Secure, high-availability endpoints for provider profiles and Clarity Score™ data.' },
                                { icon: Zap, title: 'MCP Server', desc: 'Direct integration for AI Assistants (Claude, GPT, Perplexity) to query live clinical data.' },
                                { icon: Search, title: 'Semantic Insights', desc: 'Sentiment-audited review data distilled into structured quality signals.' }
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#d4af37]/30 transition-all">
                                        <feature.icon className="w-5 h-5 text-[#d4af37]" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">{feature.title}</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link href="/docs" className="inline-flex items-center gap-2 text-[#d4af37] font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
                            Explore Developer Docs <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-[#d4af37]/5 blur-[100px] rounded-full"></div>
                        <div className="relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] border border-white/10 shadow-2xl">
                            <div className="bg-[#080e17] rounded-[1.9rem] p-6 font-mono text-sm overflow-hidden">
                                <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                                    </div>
                                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest ml-2">InjectorIndex API Response</span>
                                </div>
                                <pre className="text-emerald-400 space-y-1">
                                    <code>{`{`}</code><br />
                                    <code>{`  "city": "Scottsdale",`}</code><br />
                                    <code>{`  "provider": "Aura Medical Spa",`}</code><br />
                                    <code>{`  "Clarity Score™": 94,`}</code><br />
                                    <code>{`  "clinical_audit": {`}</code><br />
                                    <code>{`    "regenerative": true,`}</code><br />
                                    <code>{`    "sentiment": "highly_positive",`}</code><br />
                                    <code>{`    "innovation": ["Exosomes", "Daxxify"]`}</code><br />
                                    <code>{`  },`}</code><br />
                                    <code>{`  "pricing": { "botox_unit": 16 }`}</code><br />
                                    <code>{`}`}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
