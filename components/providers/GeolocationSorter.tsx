'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { setGeoSession } from '@/lib/actions/geo'

export function GeolocationSorter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Do not re-request if already sorting by distance or if city/query is explicitly set
        if (searchParams.get('sort') === 'distance' || searchParams.get('city') || searchParams.get('q')) return

        if (typeof window !== 'undefined' && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords
                // Delegate to Server Action to set HttpOnly Secure session cookie
                const ok = await setGeoSession(latitude, longitude)
                if (ok) {
                    const params = new URLSearchParams(searchParams.toString())
                    params.delete('lat')
                    params.delete('lng')
                    params.set('sort', 'distance')
                    router.replace(`/find-providers?${params.toString()}`)
                }
            }, (error) => {
                // User denied or timeout — silent fallback to default ranking
            }, {
                timeout: 5000
            })
        }
    }, [router, searchParams])

    return null // Invisible component
}
