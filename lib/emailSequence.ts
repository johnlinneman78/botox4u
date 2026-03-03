import { Resend } from 'resend'
import { NICHE } from '@/config/niche'

// Import email templates — raw HTML generators
import { day0Html, day0Subject } from './emails/day0'
import { day1Html, day1Subject } from './emails/day1'
import { day2Html, day2Subject } from './emails/day2'
import { day3Html, day3Subject } from './emails/day3'
import { day4Html, day4Subject } from './emails/day4'
import { day5Html, day5Subject } from './emails/day5'

const resend = new Resend(process.env.RESEND_API_KEY)

function scheduledAt(daysFromNow: number): string {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    date.setHours(9, 0, 0, 0) // 9 AM
    return date.toISOString()
}

function getSenderEmail(): string {
    return process.env.FROM_EMAIL || NICHE.outreach.senderEmail
}

interface EnrollParams {
    email: string
    firstName: string
    pdfLink?: string
    source: 'quiz' | 'pdf_download'
}

export async function enrollInDripSequence({
    email,
    firstName,
    pdfLink,
    source
}: EnrollParams) {
    const fromAddress = `InjectorIndex <${getSenderEmail()}>`

    console.log(`[Drip] Enrolling ${email} (${firstName}) from source: ${source}`)
    console.log(`[Drip] Using sender: ${fromAddress}`)
    console.log(`[Drip] RESEND_API_KEY present: ${!!process.env.RESEND_API_KEY}`)
    console.log(`[Drip] FROM_EMAIL: ${process.env.FROM_EMAIL}`)

    // Step 1: Send Day 0 immediately (no scheduledAt needed)
    try {
        const day0Result = await resend.emails.send({
            from: fromAddress,
            to: email,
            subject: day0Subject(),
            html: day0Html({ firstName, pdfLink }),
            tags: [
                { name: 'sequence', value: 'botox_price_course' },
                { name: 'day', value: '0' },
                { name: 'source', value: source },
            ],
        })
        console.log('[Drip] Day 0 sent:', JSON.stringify(day0Result))
    } catch (err) {
        console.error('[Drip] Day 0 FAILED:', err)
    }

    // Step 2: Schedule Days 1-5 using Resend's scheduledAt
    // Note: scheduledAt requires Resend Pro plan. If on free plan, these will fail silently.
    const futureEmails = [
        { subject: day1Subject(), html: day1Html({ firstName }), day: 1 },
        { subject: day2Subject(), html: day2Html({ firstName }), day: 2 },
        { subject: day3Subject(), html: day3Html({ firstName }), day: 3 },
        { subject: day4Subject(), html: day4Html({ firstName }), day: 4 },
        { subject: day5Subject(), html: day5Html({ firstName }), day: 5 },
    ]

    const results = await Promise.allSettled(
        futureEmails.map(({ subject, html, day }) =>
            resend.emails.send({
                from: fromAddress,
                to: email,
                subject,
                html,
                scheduledAt: scheduledAt(day),
                tags: [
                    { name: 'sequence', value: 'botox_price_course' },
                    { name: 'day', value: String(day) },
                    { name: 'source', value: source },
                ],
            })
        )
    )

    results.forEach((result, i) => {
        if (result.status === 'rejected') {
            console.error(`[Drip] Day ${i + 1} failed to schedule:`, result.reason)
        } else {
            console.log(`[Drip] Day ${i + 1} scheduled:`, JSON.stringify(result.value))
        }
    })

    return results
}
