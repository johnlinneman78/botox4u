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

    const sequence = [
        {
            subject: day0Subject(),
            html: day0Html({ firstName, pdfLink }),
            delay: undefined, // Send immediately
        },
        {
            subject: day1Subject(),
            html: day1Html({ firstName }),
            delay: scheduledAt(1),
        },
        {
            subject: day2Subject(),
            html: day2Html({ firstName }),
            delay: scheduledAt(2),
        },
        {
            subject: day3Subject(),
            html: day3Html({ firstName }),
            delay: scheduledAt(3),
        },
        {
            subject: day4Subject(),
            html: day4Html({ firstName }),
            delay: scheduledAt(4),
        },
        {
            subject: day5Subject(),
            html: day5Html({ firstName }),
            delay: scheduledAt(5),
        },
    ]

    const results = await Promise.allSettled(
        sequence.map(({ subject, html, delay }) =>
            resend.emails.send({
                from: fromAddress,
                to: email,
                subject,
                html,
                ...(delay && { scheduledAt: delay }),
                tags: [
                    { name: 'sequence', value: 'botox_price_course' },
                    { name: 'source', value: source },
                ],
            })
        )
    )

    results.forEach((result, i) => {
        if (result.status === 'rejected') {
            console.error(`Day ${i} failed to schedule:`, result.reason)
        } else {
            console.log(`Day ${i} scheduled successfully:`, result.value)
        }
    })

    return results
}
