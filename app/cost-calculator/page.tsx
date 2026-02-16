'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

const treatmentAreas = [
    { id: 'forehead', name: 'Forehead Lines', defaultUnits: 20 },
    { id: 'glabella', name: 'Frown Lines (Glabella)', defaultUnits: 25 },
    { id: 'crowfeet', name: "Crow's Feet", defaultUnits: 12 },
    { id: 'lipflip', name: 'Lip Flip', defaultUnits: 4 },
    { id: 'masseter', name: 'Jaw Slimming (Masseter)', defaultUnits: 40 },
    { id: 'tmj', name: 'TMJ Relief', defaultUnits: 50 },
]

export default function CostCalculatorPage() {
    const [selectedAreas, setSelectedAreas] = useState<string[]>([])
    const [pricePerUnit, setPricePerUnit] = useState(15)

    const toggleArea = (id: string) => {
        setSelectedAreas(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        )
    }

    const totalUnits = selectedAreas.reduce((sum, id) => {
        return sum + (treatmentAreas.find(a => a.id === id)?.defaultUnits || 0)
    }, 0)

    const totalPrice = totalUnits * pricePerUnit

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
                        Botox Cost Calculator
                    </h1>
                    <p className="text-xl text-gray-600">
                        Estimate your treatment cost based on areas and local pricing
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Settings */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">1. Select Treatment Areas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {treatmentAreas.map((area) => (
                                    <label
                                        key={area.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${selectedAreas.includes(area.id)
                                                ? 'border-secondary bg-secondary/5 ring-1 ring-secondary'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedAreas.includes(area.id)}
                                                onChange={() => toggleArea(area.id)}
                                                className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary"
                                            />
                                            <span className="font-medium text-primary">{area.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">{area.defaultUnits} units (avg)</span>
                                    </label>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">2. Local Price Per Unit</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="10"
                                        max="25"
                                        step="1"
                                        value={pricePerUnit}
                                        onChange={(e) => setPricePerUnit(parseInt(e.target.value))}
                                        className="flex-1 accent-secondary"
                                    />
                                    <span className="text-2xl font-bold text-primary w-16">
                                        ${pricePerUnit}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Average cost ranges from $12-$20 depending on your city.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results */}
                    <div className="sticky top-24 h-fit">
                        <Card className="bg-primary text-white overflow-hidden shadow-xl">
                            <div className="p-8">
                                <h3 className="text-white/70 text-sm font-medium uppercase tracking-wider mb-6">
                                    Estimated Total
                                </h3>

                                <div className="mb-8">
                                    <div className="text-6xl font-display font-bold text-secondary mb-2">
                                        {formatCurrency(totalPrice)}
                                    </div>
                                    <div className="text-white/60">
                                        Based on {totalUnits} total units at ${pricePerUnit}/unit
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between border-b border-white/10 pb-2 text-sm">
                                        <span>Treatment Areas</span>
                                        <span className="font-bold">{selectedAreas.length} selected</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/10 pb-2 text-sm">
                                        <span>Estimated Duration</span>
                                        <span className="font-bold">3-4 months</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/10 pb-2 text-sm">
                                        <span>Result Time</span>
                                        <span className="font-bold">5-7 days</span>
                                    </div>
                                </div>

                                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 text-lg">
                                    Find Providers in My City
                                </Button>

                                <p className="text-center text-xs text-white/40 mt-6 italic">
                                    *This is an estimate. Final pricing and units will be determined by your provider during consultation.
                                </p>
                            </div>
                        </Card>

                        <div className="mt-8 bg-accent/10 border border-accent/20 rounded-xl p-6">
                            <h4 className="font-display font-bold text-primary mb-2 flex items-center gap-2">
                                💡 Did you know?
                            </h4>
                            <p className="text-sm text-gray-700">
                                Most providers offer discounts when you treat multiple areas in one session. Check for &quot;Botox Packages&quot; to save up to 20%.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
