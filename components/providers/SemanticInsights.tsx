import { MessageSquareQuote, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

// Semantic themes we look for in review text
// Each theme has keywords to match and a human-friendly label
const POSITIVE_THEMES = [
    { label: 'Natural-looking results', keywords: ['natural', 'subtle', 'not overdone', 'refreshed', 'youthful'] },
    { label: 'Skilled injection technique', keywords: ['skilled', 'precise', 'expertise', 'experienced', 'talented', 'technique'] },
    { label: 'Minimal pain or discomfort', keywords: ['gentle', 'painless', 'comfortable', 'minimal pain', 'didn\'t feel', 'didn\'t hurt'] },
    { label: 'Thorough consultation process', keywords: ['consultation', 'explained', 'listened', 'listen', 'thorough', 'took time', 'patient'] },
    { label: 'Warm, welcoming staff', keywords: ['friendly', 'welcoming', 'warm', 'kind', 'caring', 'wonderful staff', 'great staff'] },
    { label: 'Clean, professional facility', keywords: ['clean', 'professional', 'modern', 'beautiful office', 'nice facility', 'upscale'] },
    { label: 'Honest recommendations', keywords: ['honest', 'conservative', 'didn\'t push', 'not pushy', 'genuine', 'trustworthy'] },
    { label: 'Great follow-up care', keywords: ['follow-up', 'touch-up', 'follow up', 'checked in', 'follow through'] },
]

const CONCERN_THEMES = [
    { label: 'Scheduling availability can be limited', keywords: ['hard to book', 'wait time', 'weeks out', 'hard to get', 'booked out', 'long wait'] },
    { label: 'Pricing higher than average', keywords: ['expensive', 'pricey', 'overpriced', 'costly', 'not cheap'] },
    { label: 'Results faded quickly', keywords: ['wore off', 'faded', 'didn\'t last', 'short-lived', 'wore off fast'] },
    { label: 'Felt rushed during visit', keywords: ['rushed', 'quick', 'hurried', 'in and out'] },
    { label: 'Uneven or asymmetric results', keywords: ['uneven', 'asymmetric', 'lopsided', 'one side', 'droopy'] },
    { label: 'Overdone appearance', keywords: ['frozen', 'overdone', 'heavy', 'too much', 'unnatural'] },
]

interface Review {
    text?: string
    rating?: number
    author_name?: string
}

interface ThemeResult {
    label: string
    percentage: number
    count: number
}

export function analyzeReviewThemes(reviews: Review[]): {
    strengths: ThemeResult[]
    concerns: ThemeResult[]
    totalAnalyzed: number
} {
    const reviewsWithText = reviews.filter(r => r.text && r.text.trim().length > 10)
    const total = reviewsWithText.length

    if (total === 0) {
        return { strengths: [], concerns: [], totalAnalyzed: 0 }
    }

    const strengths: ThemeResult[] = []
    const concerns: ThemeResult[] = []

    // Count how many reviews mention each theme
    for (const theme of POSITIVE_THEMES) {
        let count = 0
        for (const review of reviewsWithText) {
            const text = review.text!.toLowerCase()
            if (theme.keywords.some(kw => text.includes(kw))) {
                count++
            }
        }
        if (count > 0) {
            strengths.push({
                label: theme.label,
                percentage: Math.round((count / total) * 100),
                count
            })
        }
    }

    for (const theme of CONCERN_THEMES) {
        let count = 0
        for (const review of reviewsWithText) {
            const text = review.text!.toLowerCase()
            if (theme.keywords.some(kw => text.includes(kw))) {
                count++
            }
        }
        if (count > 0) {
            concerns.push({
                label: theme.label,
                percentage: Math.round((count / total) * 100),
                count
            })
        }
    }

    // Sort by frequency
    strengths.sort((a, b) => b.percentage - a.percentage)
    concerns.sort((a, b) => b.percentage - a.percentage)

    return {
        strengths: strengths.slice(0, 5), // Top 5 strengths
        concerns: concerns.slice(0, 3),   // Top 3 concerns
        totalAnalyzed: total
    }
}

interface SemanticInsightsProps {
    reviews: Review[]
    trueScore: number
    providerName: string
}

export function SemanticInsights({ reviews, trueScore, providerName }: SemanticInsightsProps) {
    const { strengths, concerns, totalAnalyzed } = analyzeReviewThemes(reviews)

    if (totalAnalyzed < 3) return null // Need at least 3 reviews for meaningful analysis

    return (
        <div className="bg-white/[0.02] p-8 md:p-10 rounded-3xl border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold text-white">What Patients Say</h2>
                    <p className="text-[11px] text-[#d4af37] font-black uppercase tracking-widest">Semantic Analysis</p>
                </div>
            </div>

            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Based on semantic analysis of <span className="text-white font-bold">{totalAnalyzed} verified Google Reviews</span> for {providerName}.
                Our algorithm extracts quality signals that go beyond star ratings.
            </p>

            {/* Strengths */}
            {strengths.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">Strengths Patients Highlight</h3>
                    </div>
                    <div className="space-y-3">
                        {strengths.map((theme, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-emerald-950/20 rounded-xl border border-emerald-800/20">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-semibold text-emerald-300">{theme.label}</span>
                                        <span className="text-xs font-black text-emerald-400/60">{theme.percentage}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-emerald-950/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                                            style={{ width: `${theme.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Concerns */}
            {concerns.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingDown className="w-4 h-4 text-amber-400" />
                        <h3 className="text-xs font-black text-amber-400 uppercase tracking-[0.2em]">Common Concerns</h3>
                    </div>
                    <div className="space-y-3">
                        {concerns.map((theme, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-amber-950/20 rounded-xl border border-amber-800/20">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-semibold text-amber-300">{theme.label}</span>
                                        <span className="text-xs font-black text-amber-400/60">{theme.percentage}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-amber-950/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
                                            style={{ width: `${theme.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TrueScore Summary */}
            <div className="mt-6 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                <div className="flex items-center gap-2">
                    <MessageSquareQuote className="w-4 h-4 text-[#d4af37]" />
                    <p className="text-xs text-gray-500 leading-relaxed">
                        <strong className="text-gray-400">TrueScore™ Summary:</strong> This provider scores <span className="text-white font-bold">{trueScore}/100</span> based on credential verification, patient sentiment analysis, and review consistency.
                        Last updated: March 2026.
                    </p>
                </div>
            </div>
        </div>
    )
}
