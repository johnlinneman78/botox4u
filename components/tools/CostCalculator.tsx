'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

const AREAS = [
    { id: 'forehead', name: 'Forehead Lines', min: 10, max: 20, default: 15 },
    { id: 'glabella', name: 'Glabella (11 Lines)', min: 15, max: 25, default: 20 },
    { id: 'crows', name: 'Crow\'s Feet', min: 12, max: 24, default: 18 },
    { id: 'brows', name: 'Brow Lift', min: 4, max: 10, default: 6 },
    { id: 'lipflip', name: 'Lip Flip', min: 4, max: 8, default: 4 },
    { id: 'masseter', name: 'Masseter (Jaw)', min: 40, max: 60, default: 50 },
]

export function CostCalculator() {
    const [selectedAreas, setSelectedAreas] = useState<string[]>([])
    const [intensity, setIntensity] = useState<'light' | 'moderate' | 'full'>('moderate')
    const [pricePerUnit, setPricePerUnit] = useState(14)

    const toggleArea = (id: string) => {
        setSelectedAreas(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        )
    }

    const calculation = useMemo(() => {
        let units = 0
        selectedAreas.forEach(areaId => {
            const area = AREAS.find(a => a.id === areaId)
            if (area) {
                if (intensity === 'light') units += area.min
                else if (intensity === 'full') units += area.max
                else units += area.default
            }
        })
        return {
            units,
            totalCost: units * pricePerUnit
        }
    }, [selectedAreas, intensity, pricePerUnit])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <section>
                    <h3 className="text-xl font-display font-bold text-primary mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm">1</span>
                        Select Treatment Areas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {AREAS.map(area => (
                            <button
                                key={area.id}
                                onClick={() => toggleArea(area.id)}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${selectedAreas.includes(area.id)
                                        ? 'border-secondary bg-secondary/[0.03] shadow-md'
                                        : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                            >
                                <span className={`font-semibold ${selectedAreas.includes(area.id) ? 'text-secondary' : 'text-primary'}`}>
                                    {area.name}
                                </span>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAreas.includes(area.id) ? 'border-secondary bg-secondary text-white' : 'border-gray-200'
                                    }`}>
                                    {selectedAreas.includes(area.id) && '✓'}
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-display font-bold text-primary mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm">2</span>
                        Desired Results
                    </h3>
                    <div className="flex p-1 bg-gray-100 rounded-2xl">
                        {(['light', 'moderate', 'full'] as const).map(level => (
                            <button
                                key={level}
                                onClick={() => setIntensity(level)}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all capitalize ${intensity === level
                                        ? 'bg-white text-secondary shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                        {intensity === 'light' && 'Subtle improvement while maintaining full facial movement ("Baby Botox").'}
                        {intensity === 'moderate' && 'Smooth out lines while preserving natural expressions. Our most popular choice.'}
                        {intensity === 'full' && 'Maximum smoothing and longevity. Ideal for deeper lines or longer intervals.'}
                    </p>
                </section>
            </div>

            <div className="lg:col-span-1">
                <Card className="sticky top-24 border-none shadow-2xl bg-primary text-white overflow-hidden p-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 -mr-16 -mt-16 rounded-full blur-3xl"></div>

                    <div className="p-8 relative z-10">
                        <div className="mb-8">
                            <h4 className="text-secondary font-bold text-xs uppercase tracking-widest mb-2">Estimated Totals</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-display font-bold">{formatCurrency(calculation.totalCost)}</span>
                                <span className="text-gray-400 font-medium">approx.</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="text-gray-400 text-sm">Total Units</span>
                                <span className="font-bold">{calculation.units} Units</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="text-gray-400 text-sm">Price per Unit</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{formatCurrency(pricePerUnit)}</span>
                                    <input
                                        type="range"
                                        min="10"
                                        max="25"
                                        value={pricePerUnit}
                                        onChange={(e) => setPricePerUnit(Number(e.target.value))}
                                        className="w-16 accent-secondary"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 mb-8 border border-white/10">
                            <h5 className="text-xs font-bold text-secondary uppercase mb-2">Area Breakdown</h5>
                            {selectedAreas.length === 0 ? (
                                <p className="text-xs text-gray-500 italic">No areas selected yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {selectedAreas.map(id => {
                                        const area = AREAS.find(a => a.id === id)
                                        return (
                                            <div key={id} className="flex justify-between text-xs">
                                                <span className="text-gray-300">{area?.name}</span>
                                                <span className="text-white">
                                                    {intensity === 'light' ? area?.min : intensity === 'full' ? area?.max : area?.default} units
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <Button className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white font-bold text-lg shadow-lg shadow-secondary/20">
                            Find Local Providers
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
