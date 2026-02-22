import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SuccessView } from './SuccessView'

export default async function SuccessPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()
    const { data: provider } = await supabase
        .from('providers')
        .select('*')
        .eq('slug', params.slug)
        .single()

    if (!provider) {
        notFound()
    }

    return <SuccessView provider={provider} />
}
