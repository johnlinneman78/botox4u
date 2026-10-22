export interface GeoCoordinatePayload {
    lat: number
    lng: number
}

const COORD_STRING_REGEX = /^-?\d{1,3}(?:\.\d+)?$/

/**
 * Validates coordinate numbers:
 * Must be finite numbers within valid geographic ranges:
 * - Latitude: -90.0 to +90.0
 * - Longitude: -180.0 to +180.0
 */
export function isValidCoordinate(lat: unknown, lng: unknown): boolean {
    if (typeof lat !== 'number' || typeof lng !== 'number') return false
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false
    if (lat < -90 || lat > 90) return false
    if (lng < -180 || lng > 180) return false
    return true
}

/**
 * Validates complete coordinate string format before any conversion.
 * Rejects trailing characters (e.g. "45.5152foo"), comma-separated pairs, non-numeric strings.
 */
export function isValidCoordinateString(str: unknown): boolean {
    if (typeof str !== 'string') return false
    const trimmed = str.trim()
    return COORD_STRING_REGEX.test(trimmed)
}

/**
 * Safely parses and validates a coordinate pair from string inputs.
 * Returns { lat, lng } if both strings are strictly valid coordinate representations within valid ranges.
 * Returns null if either fails string validation, numeric conversion, or geographic bounds.
 */
export function parseCoordinateStrings(latStr: unknown, lngStr: unknown): GeoCoordinatePayload | null {
    if (!isValidCoordinateString(latStr) || !isValidCoordinateString(lngStr)) {
        return null
    }

    const lat = Number(String(latStr).trim())
    const lng = Number(String(lngStr).trim())

    if (!isValidCoordinate(lat, lng)) {
        return null
    }

    return { lat, lng }
}
