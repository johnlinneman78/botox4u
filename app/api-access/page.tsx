'use client'

import { useState } from 'react'
import { Shield, Zap, Code, Mail, Check, Gift, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { requestApiKey } from '@/lib/actions/api-keys'
import { createApiCheckoutSession } from '@/lib/actions/checkout'

export default function ApiAccessPage() {
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    const handlePaidCheckout = async (plan: 'api_starter' | 'api_pro') => {
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address below first.')
            // Scroll to form or highlight
            document.getElementById('email-input')?.focus();
            return;
        }
        setSubmitting(true);
        try {
            await createApiCheckoutSession(plan, email);
        } catch (err) {
            console.error(err);
            setError('Payment session failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

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
      "Clarity Score™": 92,
      "style_tags": ["natural", "conservative"],
      "avg_price": 320,
      "profile_url": "https://www.injectorindex.com/provider/pdx-injectables"
    }
  ],
  "total": 1,
  "powered_by": "InjectorIndex Clarity Score™"
}`

    return (
        <div className="bg-[#FAF8F5] min-h-screen pt-32 pb-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A96E]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-xs font-black tracking-widest uppercase mb-6">
                        <Code className="w-3.5 h-3.5" /> For Developers & AI Agents
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-[#3D2B1F] mb-8 leading-tight">
                        InjectorIndex API — <span className="text-[#C9A96E]">Provider Data</span> for AI
                    </h1>
                    <p className="text-xl text-[#3D2B1F]/70 font-light max-w-2xl mx-auto leading-relaxed">
                        Query ranked aesthetic providers by city, style, price, and Clarity Score™. Structured for AI agents, health apps, and booking platforms.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {/* Free Plan */}
                    <div className="bg-[#3D2B1F]/5 border border-white/[0.08] p-8 rounded-[2.5rem] hover:bg-[#3D2B1F]/5 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-[#3D2B1F] mb-1">FREE</h3>
                                <p className="text-[#3D2B1F]/60 text-xs font-medium">For tinkering</p>
                            </div>
                            <div className="text-2xl font-black text-[#3D2B1F]">$0<span className="text-xs font-normal text-[#3D2B1F]/60">/mo</span></div>
                        </div>
                        <ul className="space-y-3 mb-8 text-sm">
                            <li className="flex items-center gap-2 text-[#3D2B1F]/70">
                                <Check className="w-4 h-4 text-[#8A9E8D]" /> 100 calls / month
                            </li>
                            <li className="flex items-center gap-2 text-[#3D2B1F]/70">
                                <Check className="w-4 h-4 text-[#8A9E8D]" /> Standard latency
                            </li>
                        </ul>
                        <a href="#request">
                            <Button className="w-full h-12 bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 hover:bg-[#3D2B1F]/10 text-[#3D2B1F] font-black uppercase tracking-widest text-[10px]">
                                Get Started
                            </Button>
                        </a>
                    </div>

                    {/* Starter Plan */}
                    <div className="bg-[#3D2B1F]/5 border border-[#C9A96E]/20 p-8 rounded-[2.5rem] hover:bg-[#3D2B1F]/5 transition-all group relative">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-[#3D2B1F] mb-1 uppercase">Starter</h3>
                                <p className="text-[#3D2B1F]/60 text-xs font-medium">For growth</p>
                            </div>
                            <div className="text-2xl font-black text-[#3D2B1F]">$29<span className="text-xs font-normal text-[#3D2B1F]/60">/mo</span></div>
                        </div>
                        <ul className="space-y-3 mb-8 text-sm">
                            <li className="flex items-center gap-2 text-gray-300">
                                <Check className="w-4 h-4 text-[#C9A96E]" /> 5,000 calls / month
                            </li>
                            <li className="flex items-center gap-2 text-gray-300">
                                <Check className="w-4 h-4 text-[#C9A96E]" /> Priority Support
                            </li>
                        </ul>
                        <Button
                            onClick={() => handlePaidCheckout('api_starter')}
                            disabled={submitting}
                            className="w-full h-12 bg-[#3D2B1F]/10 border border-white/20 hover:bg-[#C9A96E] hover:text-white text-[#3D2B1F] font-black uppercase tracking-widest text-[10px] transition-all"
                        >
                            {submitting ? '...' : 'Choose Starter'}
                        </Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gradient-to-br from-[#C9A96E]/20 to-[#0d1420] border border-[#C9A96E]/40 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="bg-[#C9A96E] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">Scaling</div>
                        </div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-[#3D2B1F] mb-1 uppercase">Pro</h3>
                                <p className="text-[#C9A96E]/70 font-display uppercase tracking-widest text-[8px] font-black">Agent Elite</p>
                            </div>
                            <div className="text-2xl font-black text-[#3D2B1F]">$99<span className="text-xs font-normal text-[#3D2B1F]/60">/mo</span></div>
                        </div>
                        <ul className="space-y-3 mb-8 text-sm">
                            <li className="flex items-center gap-2 text-gray-200">
                                <Check className="w-4 h-4 text-[#C9A96E]" /> Unlimited calls / month
                            </li>
                            <li className="flex items-center gap-2 text-gray-200">
                                <Check className="w-4 h-4 text-[#C9A96E]" /> Dedicated Account Manager
                            </li>
                        </ul>
                        <Button
                            onClick={() => handlePaidCheckout('api_pro')}
                            disabled={submitting}
                            className="w-full h-12 bg-[#C9A96E] border border-[#C9A96E] hover:bg-[#B5955B] text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[#C9A96E]/10"
                        >
                            {submitting ? '...' : 'Go Unlimited'}
                        </Button>
                    </div>
                </div>

                {/* Example */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6 px-4">
                        <Zap className="w-5 h-5 text-[#C9A96E]" />
                        <h3 className="text-xl font-bold text-[#3D2B1F]">Agent-Ready Structure</h3>
                    </div>
                    <div className="bg-[#F2EDE4] border border-[#3D2B1F]/10 rounded-2xl p-6 font-mono text-sm overflow-x-auto">
                        <pre className="text-[#3D2B1F]/70">
                            <code>{codeExample}</code>
                        </pre>
                    </div>
                </div>

                {/* Endpoint Reference */}
                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-8 px-4">
                        <Code className="w-5 h-5 text-[#C9A96E]" />
                        <h3 className="text-xl font-bold text-[#3D2B1F]">Endpoint Reference</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-[#8A9E8D]/20 text-[#8A9E8D] text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">GET</span>
                                <code className="text-[#3D2B1F] font-mono text-sm">/api/v1/providers</code>
                            </div>
                            <p className="text-[#3D2B1F]/60 text-sm mb-4">Search and filter providers by city, style, price, and Clarity Score™.</p>
                            <div className="text-xs text-[#3D2B1F]/50 font-mono space-y-1">
                                <div><span className="text-[#3D2B1F]/70">city</span> <span className="text-gray-700">string, required</span> — City name (e.g., &quot;portland&quot;)</div>
                                <div><span className="text-[#3D2B1F]/70">style</span> <span className="text-gray-700">string</span> — Filter by style tag (e.g., &quot;natural&quot;)</div>
                                <div><span className="text-[#3D2B1F]/70">max_price</span> <span className="text-gray-700">number</span> — Maximum price per unit</div>
                                <div><span className="text-[#3D2B1F]/70">min_Clarity Score™</span> <span className="text-gray-700">number</span> — Minimum Clarity Score™ (0-100)</div>
                                <div><span className="text-[#3D2B1F]/70">limit</span> <span className="text-gray-700">number</span> — Max results (default: 10, max: 50)</div>
                            </div>
                        </div>

                        <div className="bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-[#8A9E8D]/20 text-[#8A9E8D] text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">GET</span>
                                <code className="text-[#3D2B1F] font-mono text-sm">/api/v1/providers/{'{'}<span className="text-[#C9A96E]">slug</span>{'}'}</code>
                            </div>
                            <p className="text-[#3D2B1F]/60 text-sm mb-2">Get a single provider&apos;s full profile including Clarity Score™, credentials, services, pricing, and semantic data.</p>
                            <div className="text-xs text-[#3D2B1F]/50 font-mono">
                                <div><span className="text-[#3D2B1F]/70">slug</span> <span className="text-gray-700">string, path param</span> — Provider URL slug</div>
                            </div>
                        </div>

                        <div className="bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-[#8A9E8D]/20 text-[#8A9E8D] text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">GET</span>
                                <code className="text-[#3D2B1F] font-mono text-sm">/api/v1/cities</code>
                            </div>
                            <p className="text-[#3D2B1F]/60 text-sm mb-2">List all indexed cities with provider counts and directory URLs. No parameters required.</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl mx-auto" id="request">
                    <div className="bg-[#3D2B1F]/5 border border-white/[0.08] p-10 md:p-14 rounded-[3.5rem] text-center">
                        <h2 className="text-3xl font-display font-bold text-[#3D2B1F] mb-4">Request Your API Key</h2>
                        <p className="text-[#3D2B1F]/60 mb-6">Keys are manually reviewed to ensure data quality conservation.</p>

                        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs mb-6 font-bold uppercase tracking-widest">{error}</div>}

                        {success ? (
                            <div className="bg-[#8A9E8D]/10 border border-[#8A9E8D]/20 text-[#8A9E8D] p-8 rounded-3xl font-bold">
                                <Check className="w-12 h-12 mx-auto mb-4 bg-[#8A9E8D] text-[#3D2B1F] rounded-full p-2" />
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
                                        className="h-14 bg-black/40 border border-[#3D2B1F]/10 rounded-2xl px-6 text-[#3D2B1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 transition-all font-light"
                                        required
                                    />
                                    <input
                                        id="email-input"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email Address"
                                        className="h-14 bg-black/40 border border-[#3D2B1F]/10 rounded-2xl px-6 text-[#3D2B1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 transition-all font-light"
                                        required
                                    />
                                </div>
                                <Button
                                    className="w-full h-14 bg-[#C9A96E] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#C9A96E]/10"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Requesting...' : 'Request API Access'}
                                </Button>
                                <p className="text-[10px] text-[#3D2B1F]/50 uppercase tracking-widest font-black mt-4 flex items-center justify-center gap-2">
                                    <Shield className="w-3 h-3 text-[#8A9E8D]" /> ISO 27001 Data Standard Compliance
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
