'use client'

import { useState } from 'react'
import { Shield, Zap, Code, Mail, Check, Gift, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { requestApiKey } from '@/lib/actions/api-keys'

export default function ApiAccessPage() {
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        const formData = new FormData(e.currentTarget)
        const result = await requestApiKey(formData)
        if (result.success) {
            setSuccess(true)
        }
        setSubmitting(false)
    }

    const codeExample = `
// curl -H "x-api-key: YOUR_KEY" \\
// "https://www.injectorindex.com/api/v1/providers?city=portland&style=natural"

{
  "results": [
    {
      "name": "Natural Face PDX",
      "city": "Portland",
      "truescore": 92,
      "style_tags": ["natural", "conservative"],
      "avg_price": 320,
      "profile_url": "https://www.injectorindex.com/provider/pdx-injectables"
    }
  ],
  "total": 1,
  "powered_by": "InjectorIndex TrueScore™"
}`

    return (
        <div className="bg-[#0d1420] min-h-screen pt-32 pb-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-black tracking-widest uppercase mb-6">
                        <Code className="w-3.5 h-3.5" /> For Developers & AI Agents
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight">
                        InjectorIndex API — <span className="text-[#d4af37]">Provider Data</span> for AI
                    </h1>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Query ranked aesthetic providers by city, style, price, and TrueScore™. Structured for AI agents, health apps, and booking platforms.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {/* Free Plan */}
                    <div className="bg-white/[0.02] border border-white/[0.08] p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">FREE</h3>
                                <p className="text-gray-500 text-xs font-medium">For tinkering</p>
                            </div>
                            <div className="text-2xl font-black text-white">$0<span className="text-xs font-normal text-gray-500">/mo</span></div>
                        </div>
                        <ul className="space-y-3 mb-8 text-sm">
                            <li className="flex items-center gap-2 text-gray-400">
                                <Check className="w-4 h-4 text-emerald-500" /> 100 calls / month
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <Check className="w-4 h-4 text-emerald-500" /> Standard latency
                            </li>
                        </ul>
                        <a href="#request">
                            <Button className="w-full h-12 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px]">
                                Get Started
                            </Button>
                        </a>
                    </div>

                    {/* Starter Plan */}
                    <div className="bg-white/[0.04] border border-[#d4af37]/20 p-8 rounded-[2.5rem] hover:bg-white/[0.06] transition-all group relative">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1 uppercase">Starter</h3>
                                <p className="text-gray-500 text-xs font-medium">For growth</p>
                            </div>
                            <div className="text-2xl font-black text-white">$29<span className="text-xs font-normal text-gray-500">/mo</span></div>
                        </div>
                        <ul className="space-y-3 mb-8 text-sm">
                            <li className="flex items-center gap-2 text-gray-300">
                                <Check className="w-4 h-4 text-[#d4af37]" /> 5,000 calls / month
                            </li>
                            <li className="flex items-center gap-2 text-gray-300">
                                <Check className="w-4 h-4 text-[#d4af37]" /> Priority Support
                            </li>
                        </ul>
                        <Button className="w-full h-12 bg-white/10 border border-white/20 hover:bg-[#d4af37] hover:text-[#0d1420] text-white font-black uppercase tracking-widest text-[10px] transition-all">
                            Choose Starter
                        </Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gradient-to-br from-[#d4af37]/20 to-[#0d1420] border border-[#d4af37]/40 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="bg-[#d4af37] text-[#0d1420] text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">Scaling</div>
                        </div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1 uppercase">Pro</h3>
                                <p className="text-[#d4af37]/70 font-display uppercase tracking-widest text-[8px] font-black">Agent Elite</p>
                            </div>
                            <div className="text-2xl font-black text-white">$99<span className="text-xs font-normal text-gray-500">/mo</span></div>
                        </div>
                        <ul className="space-y-3 mb-8 text-sm">
                            <li className="flex items-center gap-2 text-gray-200">
                                <Check className="w-4 h-4 text-[#d4af37]" /> Unlimited calls / month
                            </li>
                            <li className="flex items-center gap-2 text-gray-200">
                                <Check className="w-4 h-4 text-[#d4af37]" /> Dedicated Account Manager
                            </li>
                        </ul>
                        <Button className="w-full h-12 bg-[#d4af37] border border-[#d4af37] hover:bg-[#c0a030] text-[#0d1420] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[#d4af37]/10">
                            Go Unlimited
                        </Button>
                    </div>
                </div>

                {/* Example */}
                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-6 px-4">
                        <Zap className="w-5 h-5 text-[#d4af37]" />
                        <h3 className="text-xl font-bold text-white">Agent-Ready Structure</h3>
                    </div>
                    <div className="bg-[#050910] border border-white/10 rounded-2xl p-6 font-mono text-sm overflow-x-auto">
                        <pre className="text-gray-400">
                            <code>{codeExample}</code>
                        </pre>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl mx-auto" id="request">
                    <div className="bg-white/[0.02] border border-white/[0.08] p-10 md:p-14 rounded-[3.5rem] text-center">
                        <h2 className="text-3xl font-display font-bold text-white mb-4">Request Your API Key</h2>
                        <p className="text-gray-500 mb-10">Keys are manually reviewed to ensure data quality conservation.</p>

                        {success ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-8 rounded-3xl font-bold">
                                <Check className="w-12 h-12 mx-auto mb-4 bg-emerald-500 text-white rounded-full p-2" />
                                <h4 className="text-xl mb-2">Request Received!</h4>
                                <p className="font-light text-sm">We'll review your application and email you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Your Name / Org"
                                        className="h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 transition-all font-light"
                                        required
                                    />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        className="h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 transition-all font-light"
                                        required
                                    />
                                </div>
                                <Button
                                    className="w-full h-14 bg-[#d4af37] text-[#0d1420] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#d4af37]/10"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Requesting...' : 'Request API Access'}
                                </Button>
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black mt-4 flex items-center justify-center gap-2">
                                    <Shield className="w-3 h-3 text-emerald-500" /> ISO 27001 Data Standard Compliance
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
