'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

function UnsubscribeContent() {
    const searchParams = useSearchParams()
    const domain = searchParams.get('domain')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const supabase = createClient()

    const handleUnsubscribe = async () => {
        if (!domain) return
        setStatus('loading')

        const { error } = await supabase
            .from('providers')
            .update({ outreach_status: 'unsubscribed' })
            .ilike('website', `%${domain}%`)

        if (error) {
            console.error(error)
            setStatus('error')
        } else {
            setStatus('success')
        }
    }

    // Auto-run if domain is present and it hasn't run yet?
    // Actually, it's better to have a button to avoid accidental unsubs from crawlers.

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center text-primary">Unsubscribe from InjectorIndex</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    {status === 'idle' && (
                        <>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to stop receiving outreach emails for <strong>{domain || 'your clinic'}</strong>?
                            </p>
                            <Button onClick={handleUnsubscribe} className="w-full bg-red-600 hover:bg-red-700 text-white">
                                Finalize Unsubscribe
                            </Button>
                        </>
                    )}

                    {status === 'loading' && <p>Processing your request...</p>}

                    {status === 'success' && (
                        <div className="text-green-600">
                            <div className="text-4xl mb-4">✅</div>
                            <p className="font-bold">You have been unsubscribed.</p>
                            <p className="text-sm text-gray-500 mt-2">We will no longer contact this clinic domain regarding this directory.</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <p className="text-red-600">Something went wrong. Please try again or contact support.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default function UnsubscribePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UnsubscribeContent />
        </Suspense>
    )
}
