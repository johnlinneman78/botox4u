import { NextResponse } from 'next/server'
import { getProvidersWithSearch } from '@/lib/actions/providers'
import { checkRateLimit } from '@/lib/validation'

const SYSTEM_PROMPT = `You are an VerifiedAesthetics assistant. Help patients find the right aesthetic injector based on their preferences. 
Ask about: their city (if not known), desired results (natural/subtle vs volume), budget, and any specific concerns. 
If you have enough info to recommend, output a special tag [SEARCH: city="...", style="...", max_price="..."] at the end of your message. 
Always be professional, medical-grade, and helpful.`

const MAX_MESSAGES = 12
const MAX_MESSAGE_CHARS = 1000

export async function POST(req: Request) {
    // The concierge UI is not mounted anywhere on the site. Keep the paid LLM
    // endpoint closed unless it is switched on deliberately.
    if (process.env.CONCIERGE_ENABLED !== 'true') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (!process.env.OPENROUTER_API_KEY) {
        return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 })
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!checkRateLimit(`concierge:${ip}`, 10, 60_000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    try {
        const body = await req.json()
        const city = typeof body?.city === 'string' ? body.city.slice(0, 100) : undefined

        // Only user/assistant turns, capped in count and length. Visitors must
        // not be able to send their own system prompts.
        const messages = (Array.isArray(body?.messages) ? body.messages : [])
            .filter((m: any) => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string')
            .slice(-MAX_MESSAGES)
            .map((m: any) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }))

        if (messages.length === 0) {
            return NextResponse.json({ error: 'No message' }, { status: 400 })
        }

        // 1. Analyze user intent with OpenRouter
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://injectorindex.com',
                'X-Title': 'VerifiedAesthetics Concierge'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-001',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages
                ]
            })
        })

        const data = await response.json()

        if (data.error) {
            console.error('OpenRouter Error:', data.error)
            throw new Error(`OpenRouter reported an error: ${data.error.message || 'Unknown error'}`)
        }

        if (!data.choices || data.choices.length === 0) {
            console.error('OpenRouter unexpected response:', data)
            throw new Error('OpenRouter returned no choices')
        }

        const aiMessage = data.choices[0].message
        let providers: any[] = []

        // 2. Extract search intent if present
        const searchMatch = aiMessage.content?.match(/\[SEARCH: (.*?)\]/)
        if (searchMatch) {
            const paramsStr = searchMatch[1]
            const cityMatch = paramsStr.match(/city="(.*?)"/)
            const styleMatch = paramsStr.match(/style="(.*?)"/)
            const priceMatch = paramsStr.match(/max_price="(.*?)"/)

            const searchCity = cityMatch ? cityMatch[1] : city
            const searchStyle = styleMatch ? styleMatch[1] : undefined
            const searchPrice = priceMatch ? parseInt(priceMatch[1]) : undefined

            if (searchCity) {
                providers = await getProvidersWithSearch({
                    city: searchCity,
                    style: searchStyle,
                    maxPrice: searchPrice,
                    limit: 3
                }) as any[]
            }
        }

        return NextResponse.json({
            message: aiMessage.content?.replace(/\[SEARCH: .*?\]/, '').trim(),
            recommendations: providers.map(p => ({
                id: p.id,
                name: p.name,
                city: p.city,
                clarityScore: p.score_total,
                image: p.imageUrl || p.hero_image_url,
                slug: p.slug
            }))
        })
    } catch (error) {
        console.error('Concierge Error:', error)
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
    }
}
