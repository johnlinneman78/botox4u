'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DollarSign, ShieldCheck, Target, Globe, Phone, Building, Loader2, Save, ArrowRight } from 'lucide-react'
import { claimProviderProfile } from '@/lib/actions/provider-actions'

export function EditForm({ provider, initialNpi }: { provider: any, initialNpi?: string }) {
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
            // Wait for 1s then redirect to the success page
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
                <div className={`p-6 rounded-3xl text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {message.text}
                </div>
            )}

            <input type="hidden" name="provider_id" value={provider.id} />
            <input type="hidden" name="npi_number" value={initialNpi} />

            {/* SECTION 1: PUBLIC PRICING (HIGH IMPACT) */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary">Transparent Pricing</h3>
                        <p className="text-sm text-gray-500 font-light">Listing your real cost-per-unit boosts your Transparency Signal by +10 pts.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-[2rem] bg-gray-50 border border-gray-100">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary uppercase tracking-wider">Botox Price per Unit ($)</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <input
                                required
                                type="number"
                                name="price_per_unit"
                                step="0.01"
                                defaultValue={provider.price_per_unit}
                                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 focus:bg-white focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-lg"
                                placeholder="12.00"
                            />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-center">
                        <p className="text-xs text-gray-400 text-center font-light">
                            Typical price in <strong>{provider.city}</strong>: $11 - $14 / unit.
                        </p>
                    </div>
                </div>
            </div>

            {/* SECTION 2: PRACTICE INFO */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <Building className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary">Practice Information</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary uppercase tracking-wider">Clinic Name</label>
                        <input
                            name="name"
                            defaultValue={provider.name}
                            className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-secondary/10 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary uppercase tracking-wider">Business Type</label>
                        <select
                            name="business_type"
                            defaultValue={provider.business_type}
                            className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-secondary/10 outline-none transition-all"
                        >
                            <option value="Medspa">Medspa</option>
                            <option value="Clinic">Clinic</option>
                            <option value="Dermatology">Dermatology</option>
                            <option value="Plastic Surgery">Plastic Surgery</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary uppercase tracking-wider">Website URL</label>
                        <div className="relative">
                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                name="website"
                                type="url"
                                defaultValue={provider.website}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-secondary/10 outline-none transition-all"
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary uppercase tracking-wider">Display Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                name="phone"
                                type="tel"
                                defaultValue={provider.phone}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-secondary/10 outline-none transition-all"
                                placeholder="(555) 000-0000"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-primary uppercase tracking-wider">Clinic Bio (About)</label>
                        <textarea
                            name="description"
                            rows={4}
                            defaultValue={provider.description}
                            className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-secondary/10 outline-none transition-all resize-none"
                            placeholder="Share what makes your practice unique..."
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 3: TREATMENT MENU CHECKLIST */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary">Treatment Menu</h3>
                        <p className="text-sm text-gray-500 font-light">Select all treatments offered at this location.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-[3rem] bg-gray-50 border border-gray-100">
                    <div>
                        <h4 className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4">Injectables</h4>
                        <div className="space-y-3">
                            {["Botox / Dysport / Xeomin / Daxxify", "Lip filler", "Cheek / midface filler", "Jawline / chin filler", "Under-eye filler", "Kybella", "PRF / PRP"].map(t => (
                                <label key={t} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" name="services" value={t} className="w-5 h-5 rounded border-gray-200 text-secondary focus:ring-secondary/20" defaultChecked={provider.services_offered?.includes(t)} />
                                    <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4">Skin & Laser</h4>
                        <div className="space-y-3">
                            {["Chemical peels", "Microneedling", "Morpheus8 / RF", "HydraFacial", "Laser Resurfacing", "Laser Hair Removal", "IPL / Photofacial"].map(t => (
                                <label key={t} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" name="services" value={t} className="w-5 h-5 rounded border-gray-200 text-secondary focus:ring-secondary/20" defaultChecked={provider.services_offered?.includes(t)} />
                                    <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 4: SMS OPT-IN (TCPA COMPLIANT) */}
            <div className="p-8 rounded-[2rem] bg-secondary/5 border border-secondary/10 space-y-4">
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-secondary text-white mt-1">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-primary">Get notified when patients view your profile</h4>
                        <p className="text-sm text-gray-500 font-light mb-4">
                            Receive weekly profile stats and patient activity alerts via text. Message frequency varies. Reply STOP to cancel.
                        </p>
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input type="checkbox" name="sms_opt_in" value="true" className="mt-1 w-5 h-5 rounded border-gray-200 text-secondary focus:ring-secondary/20" />
                            <span className="text-xs text-gray-400 font-light leading-relaxed">
                                I agree to receive SMS updates from Botox-4U.com. I understand my phone number will be stored securely with my opt-in timestamp and IP.
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* SECTION 5: PHILOSOPHY */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-green-50 text-green-600">
                        <ArrowRight className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary">Patient Outcome Philosophy</h3>
                    </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 space-y-4">
                    <p className="text-sm text-gray-500 font-light">Does your practice specialize in a specific aesthetic look?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { id: 'natural', label: 'Conservative / Natural', desc: 'Focus on subtle refreshment and movement.' },
                            { id: 'full', label: 'Full Correction', desc: 'Maximum freezing and wrinkle elimination.' }
                        ].map((opt) => (
                            <label key={opt.id} className="relative flex flex-col p-6 bg-white border border-gray-100 rounded-3xl cursor-pointer hover:border-secondary transition-all group">
                                <input type="radio" name="philosophy" value={opt.id} className="sr-only" defaultChecked={opt.id === 'natural'} />
                                <div className="font-bold text-primary group-has-[:checked]:text-secondary">{opt.label}</div>
                                <div className="text-xs text-gray-400 font-light">{opt.desc}</div>
                                <div className="absolute top-4 right-4 w-4 h-4 rounded-full border border-gray-200 group-has-[:checked]:border-secondary group-has-[:checked]:bg-secondary" />
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-sm font-medium">Verified by NPI Integration</span>
                </div>
                <button
                    disabled={loading}
                    type="submit"
                    className="w-full md:w-auto bg-primary text-white px-12 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            <span>Save Profile & Publish</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
