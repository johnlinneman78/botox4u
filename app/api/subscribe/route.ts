import { NextRequest, NextResponse } from 'next/server'
import { enrollInDripSequence } from '@/lib/emailSequence'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, firstName, source, pdfLink } = body

        console.log('[Subscribe API] Received:', { email, firstName, source })

        if (!email || !firstName) {
            console.error('[Subscribe API] Missing required fields:', { email, firstName })
            return NextResponse.json(
                { error: 'Email and first name required' },
                { status: 400 }
            )
        }

        const results = await enrollInDripSequence({ email, firstName, source, pdfLink })

        console.log('[Subscribe API] Enrollment complete for:', email)

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('[Subscribe API] Error:', error)
        return NextResponse.json(
            { error: 'Failed to enroll', details: String(error) },
            { status: 500 }
        )
    }
}
