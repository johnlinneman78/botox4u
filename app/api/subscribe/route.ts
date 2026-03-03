import { NextRequest, NextResponse } from 'next/server'
import { enrollInDripSequence } from '@/lib/emailSequence'

export async function POST(req: NextRequest) {
    try {
        const { email, firstName, source, pdfLink } = await req.json()

        if (!email || !firstName) {
            return NextResponse.json(
                { error: 'Email and first name required' },
                { status: 400 }
            )
        }

        await enrollInDripSequence({ email, firstName, source, pdfLink })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Drip enrollment error:', error)
        return NextResponse.json(
            { error: 'Failed to enroll' },
            { status: 500 }
        )
    }
}
