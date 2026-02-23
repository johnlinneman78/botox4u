import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SuccessView } from './SuccessView'

export default async function SuccessPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()
    const { data: provider } = await supabase
        .from('providers')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!provider) {
        notFound()
    }

    return <SuccessView provider={provider} />
}
