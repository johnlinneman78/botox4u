'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DollarSign, ShieldCheck, Target, Globe, Phone, Building, Loader2, Save, Dna, Leaf, Clock, Zap } from 'lucide-react'
import { claimProviderProfile } from '@/lib/actions/provider-actions'

const REGEN_TREATMENTS = [
    { value: 'Polynucleotides (PNs)', label: 'Polynucleotides (PNs)', icon: '🔬', hot: true },
    { value: 'Daxxify / Long-Acting Tox', label: 'Daxxify / Long-Acting Tox', icon: '⏱', hot: true },
    { value: 'Plant-Derived Exosomes', label: 'Plant-Derived Exosomes', icon: '🌿', hot: true },
    { value: 'Biostimulators (Sculptra)', label: 'Biostimulators (Sculptra)', icon: '💎', hot: false },
    { value: 'PRF / PRP', label: 'PRF / PRP', icon: '🩸', hot: false },
    { value: 'NAD+ IV Therapy', label: 'NAD+ IV Therapy', icon: '⚡', hot: false },
]

const INJECTABLE_TREATMENTS = [
    'Botox / Dysport / Xeomin',
    'Lip filler',
    'Cheek / midface filler',
    'Jawline / chin filler',
    'Under-eye filler',
    'Kybella',
]

const SKIN_TREATMENTS = [
    'Microneedling',
    'Morpheus8 / RF Microneedling',
    'HydraFacial',
    'Laser Resurfacing',
    'Chemical Peels',
    'IPL / Photofacial',
    'LED Light Therapy',
]

export function EditForm({ provider, initialNpi, initialEmail }: { provider: any, initialNpi?: string, initialEmail?: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const result = await claimProviderProfile(formData)

        setLoading(false)
        if (result.success) {
            setMessage({ type: 'success', text: 'Success! Your profile has been claimed and updated.' })
            setTimeout(() => {
                router.push(`/claim/${provider.slug}/success`)
            }, 1000)
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {message && (
                <div className={`p-6 rounded-3xl text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-[#8A9E8D]/10 text-[#8A9E8D] border border-[#8A9E8D]/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    {message.text}
                </div>
            )}

            <input type="hidden" name="provider_id" value={provider.id} />
            <input type="hidden" name="npi_number" value={initialNpi} />
            <input type="hidden" name="claim_email" value={initialEmail || ''} />

            {/* SECTION 1: PUBLIC PRICING (HIGH IMPACT) */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-[#C9A96E]/10 text-[#C9A96E] border border-[#C9A96E]/20">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[#3D2B1F]">Transparent Pricing</h3>
                        <p className="text-sm text-[#3D2B1F]/60 font-light">Listing your real cost-per-unit strengthens your Transparency Signal within our proprietary algorithm.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-[2rem] bg-[#3D2B1F]/5 border border-[#3D2B1F]/10">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#3D2B1F] uppercase tracking-wider">Botox Price per Unit ($)</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#3D2B1F]/60 font-bold">$</span>
                            <input
                                required
                                type="number"
                                name="price_per_unit"
                                step="0.01"
                                defaultValue={provider.price_per_unit}
                                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-white/[0.08] bg-[#3D2B1F]/5 focus:bg-[#3D2B1F]/5 focus:ring-4 focus:ring-[#C9A96E]/10 outline-none transition-all text-lg text-[#3D2B1F] placeholder-gray-600"
                                placeholder="12.00"
                            />
                        </div>
                    </div>
                    <div className="bg-[#3D2B1F]/5 p-6 rounded-2xl border border-[#3D2B1F]/10 flex items-center justify-center">
                        <p className="text-xs text-[#3D2B1F]/60 text-center font-light">
                            Clinics set their own prices — enter what you charge per unit.
                        </p>
                    </div>
                </div>
            </div>

            {/* SECTION 2: PRACTICE INFO */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Building className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[#3D2B1F]">Practice Information</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#3D2B1F] uppercase tracking-wider">Clinic Name</label>
                        <input
                            name="name"
                            defaultValue={provider.name}
                            className="w-full px-6 py-4 rounded-2xl border border-white/[0.08] bg-[#3D2B1F]/5 focus:bg-[#3D2B1F]/5 focus:ring-4 focus:ring-[#C9A96E]/10 outline-none transition-all text-[#3D2B1F]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#3D2B1F] uppercase tracking-wider">Business Type</label>
                        <select
                            name="business_type"
                            defaultValue={provider.business_type}
                            className="w-full px-6 py-4 rounded-2xl border border-white/[0.08] bg-[#3D2B1F]/5 focus:bg-[#3D2B1F]/5 focus:ring-4 focus:ring-[#C9A96E]/10 outline-none transition-all text-[#3D2B1F]"
                        >
                            <option value="Medspa">Medspa</option>
                            <option value="Clinic">Clinic</option>
                            <option value="Dermatology">Dermatology</option>
                            <option value="Plastic Surgery">Plastic Surgery</option>
                            <option value="Regenerative Medicine">Regenerative Medicine</option>
                            <option value="Nurse-Led Injection Studio">Nurse-Led Injection Studio</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#3D2B1F] uppercase tracking-wider">Website URL</label>
                        <div className="relative">
                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-[#3D2B1F]/50 w-5 h-5" />
                            <input
                                name="website"
                                type="url"
                                defaultValue={provider.website}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-white/[0.08] bg-[#3D2B1F]/5 focus:bg-[#3D2B1F]/5 focus:ring-4 focus:ring-[#C9A96E]/10 outline-none transition-all text-[#3D2B1F]"
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#3D2B1F] uppercase tracking-wider">Display Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#3D2B1F]/50 w-5 h-5" />
                            <input
                                name="phone"
                                type="tel"
                                defaultValue={provider.phone}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-white/[0.08] bg-[#3D2B1F]/5 focus:bg-[#3D2B1F]/5 focus:ring-4 focus:ring-[#C9A96E]/10 outline-none transition-all text-[#3D2B1F]"
                                placeholder="(555) 000-0000"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-[#3D2B1F] uppercase tracking-wider">Clinic Bio (About)</label>
                        <textarea
                            name="description"
                            rows={4}
                            defaultValue={provider.description}
                            className="w-full px-6 py-4 rounded-2xl border border-white/[0.08] bg-[#3D2B1F]/5 focus:bg-[#3D2B1F]/5 focus:ring-4 focus:ring-[#C9A96E]/10 outline-none transition-all resize-none text-[#3D2B1F] placeholder-gray-600"
                            placeholder="Share what makes your practice unique..."
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 3: REGENERATIVE TREATMENTS (NEW - HIGH PRIORITY) */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-[#8A9E8D]/10 text-[#8A9E8D] border border-[#8A9E8D]/20">
                        <Dna className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[#3D2B1F]">Regenerative Treatments</h3>
                        <p className="text-sm text-[#3D2B1F]/60 font-light">List the treatments you offer so patients can find you. The treatments you offer don&apos;t change your Clarity Score™; publishing your price per unit does.</p>
                    </div>
                </div>

                <div className="p-8 rounded-[3rem] bg-gradient-to-br from-emerald-950/30 to-[#101827] border border-emerald-800/20">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-xs font-black text-[#8A9E8D] uppercase tracking-widest">2026 Regen Menu</span>
                        <span className="text-[10px] font-bold text-[#C9A96E] bg-[#C9A96E]/10 px-2 py-0.5 rounded-full border border-[#C9A96E]/20">Aesthetic Signal</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {REGEN_TREATMENTS.map(t => (
                            <label key={t.value} className="flex items-center gap-3 cursor-pointer group p-3 rounded-2xl hover:bg-[#3D2B1F]/5 transition-colors">
                                <input type="checkbox" name="services" value={t.value} className="w-5 h-5 rounded border-emerald-800/40 bg-[#3D2B1F]/5 text-[#8A9E8D] focus:ring-[#8A9E8D]/20" defaultChecked={provider.services_offered?.includes(t.value)} />
                                <span className="text-lg mr-1">{t.icon}</span>
                                <span className="text-sm text-[#3D2B1F]/70 group-hover:text-[#3D2B1F] transition-colors font-medium">{t.label}</span>
                                {t.hot && <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse ml-auto shrink-0" />}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 4: TRADITIONAL TREATMENTS */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[#3D2B1F]">Full Treatment Menu</h3>
                        <p className="text-sm text-[#3D2B1F]/60 font-light">Select all additional treatments offered at this location.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-[3rem] bg-[#3D2B1F]/5 border border-[#3D2B1F]/10">
                    <div>
                        <h4 className="text-xs font-black text-[#C9A96E] uppercase tracking-[0.2em] mb-4">Injectables</h4>
                        <div className="space-y-3">
                            {INJECTABLE_TREATMENTS.map(t => (
                                <label key={t} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" name="services" value={t} className="w-5 h-5 rounded border-[#3D2B1F]/10 bg-[#3D2B1F]/5 text-[#C9A96E] focus:ring-[#C9A96E]/20" defaultChecked={provider.services_offered?.includes(t)} />
                                    <span className="text-sm text-[#3D2B1F]/60 group-hover:text-[#3D2B1F] transition-colors">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-[#C9A96E] uppercase tracking-[0.2em] mb-4">Skin & Laser</h4>
                        <div className="space-y-3">
                            {SKIN_TREATMENTS.map(t => (
                                <label key={t} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" name="services" value={t} className="w-5 h-5 rounded border-[#3D2B1F]/10 bg-[#3D2B1F]/5 text-[#C9A96E] focus:ring-[#C9A96E]/20" defaultChecked={provider.services_offered?.includes(t)} />
                                    <span className="text-sm text-[#3D2B1F]/60 group-hover:text-[#3D2B1F] transition-colors">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 5: SMS OPT-IN (TCPA COMPLIANT) */}
            <div className="p-8 rounded-[2rem] bg-[#C9A96E]/5 border border-[#C9A96E]/10 space-y-4">
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-[#C9A96E] text-white mt-1">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-[#3D2B1F]">Get notified when patients view your profile</h4>
                        <p className="text-sm text-[#3D2B1F]/60 font-light mb-4">
                            Receive weekly profile stats and patient activity alerts via text. Message frequency varies. Reply STOP to cancel.
                        </p>
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input type="checkbox" name="sms_opt_in" value="true" className="mt-1 w-5 h-5 rounded border-[#3D2B1F]/10 bg-[#3D2B1F]/5 text-[#C9A96E] focus:ring-[#C9A96E]/20" />
                            <span className="text-xs text-[#3D2B1F]/50 font-light leading-relaxed">
                                I agree to receive SMS updates from VerifiedAesthetics.com. I understand my phone number will be stored securely with my opt-in timestamp and IP.
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* SECTION 6: PHILOSOPHY */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Leaf className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[#3D2B1F]">Treatment Philosophy</h3>
                        <p className="text-sm text-[#3D2B1F]/60 font-light">This helps patients find providers aligned with their aesthetic goals.</p>
                    </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 space-y-4">
                    <p className="text-sm text-[#3D2B1F]/60 font-light">Does your practice align with the Neo-Romantic aesthetic movement in regenerative medicine?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { id: 'regenerative', label: 'Clarity Score™ Aesthetic / Regenerative', desc: 'Biological repair, PNs, facial harmony, undetectable results.', recommended: true },
                            { id: 'natural', label: 'Conservative / Natural', desc: 'Subtle refreshment with minimal intervention.' },
                            { id: 'full', label: 'Full Correction', desc: 'Maximum wrinkle elimination & volume restoration.' }
                        ].map((opt) => (
                            <label key={opt.id} className={`relative flex flex-col p-6 border rounded-3xl cursor-pointer transition-all group ${'recommended' in opt ? 'bg-emerald-950/20 border-emerald-800/30 hover:border-emerald-600/40' : 'bg-[#3D2B1F]/5 border-[#3D2B1F]/10 hover:border-[#C9A96E]/30'
                                }`}>
                                <input type="radio" name="philosophy" value={opt.id} className="sr-only" defaultChecked={opt.id === 'regenerative'} />
                                {'recommended' in opt && (
                                    <span className="absolute -top-2.5 right-4 text-[9px] font-black uppercase tracking-widest bg-[#8A9E8D]/20 text-[#8A9E8D] px-2 py-0.5 rounded-full border border-[#8A9E8D]/30">
                                        Proprietary Clarity Score™ Signal
                                    </span>
                                )}
                                <div className="font-bold text-[#3D2B1F] group-has-[:checked]:text-[#C9A96E] mb-1">{opt.label}</div>
                                <div className="text-xs text-[#3D2B1F]/60 font-light">{opt.desc}</div>
                                <div className="absolute top-6 right-6 w-4 h-4 rounded-full border border-[#3D2B1F]/10 group-has-[:checked]:border-[#C9A96E] group-has-[:checked]:bg-[#C9A96E]" />
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-[#3D2B1F]/10 flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-2 text-[#3D2B1F]/50">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-sm font-medium">Verified by NPI Integration · Free for 30 days</span>
                </div>
                <button
                    disabled={loading}
                    type="submit"
                    className="w-full md:w-auto bg-[#C9A96E] hover:bg-[#B5955B] text-white px-12 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-[#C9A96E]/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            <span>Claim & Publish Profile</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
