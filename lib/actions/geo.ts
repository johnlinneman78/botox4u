'use server'

import { cookies } from 'next/headers'
import { isValidCoordinate, type GeoCoordinatePayload } from '@/lib/utils/geo'

export type { GeoCoordinatePayload }

/**
 * Server Action: sets an HttpOnly, Secure session cookie with user coordinates.
 * JavaScript (including third-party scripts) CANNOT read this cookie.
 */
export async function setGeoSession(lat: number, lng: number): Promise<boolean> {
    if (!isValidCoordinate(lat, lng)) {
        return false
    }

    const cookieStore = await cookies()
    cookieStore.set('user_geo', JSON.stringify({ lat, lng }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        // No maxAge specified: true browser session cookie (cleared on browser close)
    })

    return true
}

/**
 * Reads user coordinates from the HttpOnly session cookie on the server.
 */
export async function getGeoSession(): Promise<GeoCoordinatePayload | null> {
    const cookieStore = await cookies()
    const raw = cookieStore.get('user_geo')?.value
    if (!raw) return null

    try {
        const parsed = JSON.parse(decodeURIComponent(raw))
        if (isValidCoordinate(parsed?.lat, parsed?.lng)) {
            return { lat: parsed.lat, lng: parsed.lng }
        }
    } catch {
        // Corrupted cookie
    }

    return null
}
