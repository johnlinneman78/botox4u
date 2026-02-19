'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function GeolocationSorter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Only run if we don't already have coordinates
        if (searchParams.get('lat') && searchParams.get('lng')) return

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords
                const params = new URLSearchParams(searchParams.toString())
                params.set('lat', latitude.toString())
                params.set('lng', longitude.toString())
                router.replace(`/find-providers?${params.toString()}`)
            }, (error) => {
                console.warn("Geolocation failed or denied:", error)
            }, {
                timeout: 5000
            })
        }
    }, [router, searchParams])

    return null // Invisible component
}
