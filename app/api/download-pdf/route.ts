import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/factory'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    // The actual URL where you host the PDF (Supabase Storage or similar)
    const PDF_URL = 'https://your-supabase-project.supabase.co/storage/v1/object/public/lead-magnets/2026-Botox-Price-Guide.pdf'

    if (email) {
        try {
            const supabase = await getSupabaseServer(await cookies())
            // Track the download in the leads table or a separate events table
            if (supabase) {
                await supabase
                    .from('leads')
                    .update({ status: 'downloaded_pdf' })
                    .eq('email', email)
            }
        } catch (err) {
            console.error('Tracking error:', err)
        }
    }

    // Redirect to the actual PDF
    return NextResponse.redirect(PDF_URL)
}
