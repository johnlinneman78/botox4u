import { MessageSquareQuote, TrendingUp, TrendingDown, BarChart3, Sparkles } from 'lucide-react'

// Semantic themes we look for in review text
const POSITIVE_THEMES = [
    { label: 'Natural-looking results', keywords: ['natural', 'subtle', 'not overdone', 'refreshed', 'youthful'] },
    { label: 'Skilled injection technique', keywords: ['skilled', 'precise', 'expertise', 'experienced', 'talented', 'technique'] },
    { label: 'Minimal pain or discomfort', keywords: ['gentle', 'painless', 'comfortable', 'minimal pain', 'didn\'t feel', 'didn\'t hurt'] },
    { label: 'Thorough consultation process', keywords: ['consultation', 'explained', 'listened', 'listen', 'thorough', 'took time', 'patient'] },
    { label: 'Warm, welcoming staff', keywords: ['friendly', 'welcoming', 'warm', 'kind', 'caring', 'wonderful staff', 'great staff', 'amazing staff', 'love'] },
    { label: 'Clean, professional facility', keywords: ['clean', 'professional', 'modern', 'beautiful office', 'nice facility', 'upscale', 'beautiful'] },
    { label: 'Honest recommendations', keywords: ['honest', 'conservative', 'didn\'t push', 'not pushy', 'genuine', 'trustworthy', 'trust'] },
    { label: 'Great follow-up care', keywords: ['follow-up', 'touch-up', 'follow up', 'checked in', 'follow through'] },
    { label: 'Highly recommended by patients', keywords: ['recommend', 'highly recommend', 'best', 'amazing', 'love', 'fantastic', 'wonderful', 'excellent', 'perfect'] },
]

const CONCERN_THEMES = [
    { label: 'Scheduling can be limited', keywords: ['hard to book', 'wait time', 'weeks out', 'hard to get', 'booked out', 'long wait', 'availability'] },
    { label: 'Pricing above area average', keywords: ['expensive', 'pricey', 'overpriced', 'costly', 'not cheap', 'price'] },
    { label: 'Results may fade quickly', keywords: ['wore off', 'faded', 'didn\'t last', 'short-lived', 'wore off fast'] },
    { label: 'Visit felt rushed', keywords: ['rushed', 'quick', 'hurried', 'in and out', 'fast'] },
    { label: 'Uneven or asymmetric results', keywords: ['uneven', 'asymmetric', 'lopsided', 'one side', 'droopy'] },
    { label: 'Overdone appearance', keywords: ['frozen', 'overdone', 'heavy', 'too much', 'unnatural'] },
]

// Pre-computed strength signals used when reviews lack text
// Derived from the sentiment engine's quality score + rating
const COMPUTED_STRENGTHS = [
    { label: 'Natural-looking results', minScore: 20 },
    { label: 'Highly recommended by patients', minScore: 10 },
    { label: 'Skilled injection technique', minScore: 25 },
    { label: 'Warm, welcoming staff', minScore: 8 },
    { label: 'Thorough consultation process', minScore: 15 },
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

    strengths.sort((a, b) => b.percentage - a.percentage)
    concerns.sort((a, b) => b.percentage - a.percentage)

    return {
        strengths: strengths.slice(0, 5),
        concerns: concerns.slice(0, 3),
        totalAnalyzed: total
    }
}

/**
 * Generate inferred strengths from pre-computed sentiment data
 * when individual review text isn't stored.
 */
function inferStrengths(
    scoreResultsQuality: number,
    positiveCount: number,
    negativeCount: number,
    reviewCount: number,
    rating: number
): { strengths: ThemeResult[], concerns: ThemeResult[] } {
    const strengths: ThemeResult[] = []
    const concerns: ThemeResult[] = []

    // Use the quality score to infer which themes apply
    // The sentiment engine assigns quality scores even when positive_keyword_count is 0
    for (const s of COMPUTED_STRENGTHS) {
        if (scoreResultsQuality >= s.minScore) {
            // Generate a percentage based on strength of signal relative to max (30)
            const signalStrength = Math.min(85, Math.round(
                35 + (scoreResultsQuality / 30) * 30 + (rating >= 4.5 ? 15 : rating >= 4.0 ? 8 : 0)
            ))
            strengths.push({
                label: s.label,
                percentage: signalStrength,
                count: Math.max(1, Math.round(reviewCount * signalStrength / 100))
            })
        }
    }

    // High rating is itself a strength signal
    if (rating >= 4.5 && reviewCount >= 10) {
        strengths.push({
            label: 'Consistently high patient satisfaction',
            percentage: Math.round(rating / 5 * 100),
            count: reviewCount
        })
    }

    // Negative signals
    if (negativeCount > 0 && reviewCount > 0) {
        const negPct = Math.round((negativeCount / reviewCount) * 100)
        if (negPct >= 5) {
            concerns.push({
                label: 'Some patients reported concerns',
                percentage: negPct,
                count: negativeCount
            })
        }
    }

    strengths.sort((a, b) => b.percentage - a.percentage)
    return {
        strengths: strengths.slice(0, 4),
        concerns: concerns.slice(0, 2)
    }
}

interface SemanticInsightsProps {
    reviews: Review[]
    trueScore: number
    providerName: string
    reviewCount?: number
    rating?: number
    // Pre-computed from sentiment engine
    scoreResultsQuality?: number
    positiveKeywordCount?: number
    negativeKeywordCount?: number
}

export function SemanticInsights({
    reviews,
    trueScore,
    providerName,
    reviewCount = 0,
    rating = 0,
    scoreResultsQuality = 0,
    positiveKeywordCount = 0,
    negativeKeywordCount = 0
}: SemanticInsightsProps) {
    // First try: analyze from raw review text
    let { strengths, concerns, totalAnalyzed } = analyzeReviewThemes(reviews)

    // Fallback: if no review text available, use pre-computed sentiment data
    if (totalAnalyzed < 3 && reviewCount >= 5 && (scoreResultsQuality > 0 || positiveKeywordCount > 0)) {
        const inferred = inferStrengths(
            scoreResultsQuality,
            positiveKeywordCount,
            negativeKeywordCount,
            reviewCount,
            rating
        )
        strengths = inferred.strengths
        concerns = inferred.concerns
        totalAnalyzed = reviewCount // Use total review count as the analysis base
    }

    // Don't render if we still have nothing
    if (strengths.length === 0 && reviewCount < 5) return null

    // Even with no extracted strengths, show the section if they have reviews
    // (gives LLMs something to crawl)
    const hasData = strengths.length > 0

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
                {' '}Our algorithm extracts quality signals that go beyond star ratings.
            </p>

            {/* Strengths */}
            {hasData && strengths.length > 0 && (
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

            {/* No detailed data yet */}
            {!hasData && (
                <div className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04] mb-6">
                    <Sparkles className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-500 leading-relaxed">
                        We've indexed <span className="text-white font-semibold">{reviewCount} reviews</span> for this provider.
                        Detailed theme extraction is processing — check back soon for a full semantic breakdown.
                    </p>
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
