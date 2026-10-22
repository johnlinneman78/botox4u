/**
 * Canonical directory locations for InjectorIndex (VerifiedAesthetics).
 * Used for strict allowlisting across analytics URLs and event telemetry.
 */

export interface DirectoryCity {
    slug: string       // e.g. "portland"
    name: string       // e.g. "Portland"
    state: string      // e.g. "OR"
}

export const SUPPORTED_CITIES: readonly DirectoryCity[] = [
    { slug: "new-york", name: "New York", state: "NY" },
    { slug: "los-angeles", name: "Los Angeles", state: "CA" },
    { slug: "miami", name: "Miami", state: "FL" },
    { slug: "chicago", name: "Chicago", state: "IL" },
    { slug: "dallas", name: "Dallas", state: "TX" },
    { slug: "houston", name: "Houston", state: "TX" },
    { slug: "atlanta", name: "Atlanta", state: "GA" },
    { slug: "denver", name: "Denver", state: "CO" },
    { slug: "san-diego", name: "San Diego", state: "CA" },
    { slug: "nashville", name: "Nashville", state: "TN" },
    { slug: "austin", name: "Austin", state: "TX" },
    { slug: "charlotte", name: "Charlotte", state: "NC" },
    { slug: "las-vegas", name: "Las Vegas", state: "NV" },
    { slug: "tampa", name: "Tampa", state: "FL" },
    { slug: "portland", name: "Portland", state: "OR" },
    { slug: "minneapolis", name: "Minneapolis", state: "MN" },
    { slug: "philadelphia", name: "Philadelphia", state: "PA" },
    { slug: "washington", name: "Washington", state: "DC" },
    { slug: "boston", name: "Boston", state: "MA" },
    { slug: "seattle", name: "Seattle", state: "WA" },
    { slug: "scottsdale", name: "Scottsdale", state: "AZ" },
    { slug: "rochester", name: "Rochester", state: "NY" },
    { slug: "plano", name: "Plano", state: "TX" },
    { slug: "bellevue", name: "Bellevue", state: "WA" },
    { slug: "boca-raton", name: "Boca Raton", state: "FL" },
    { slug: "henderson", name: "Henderson", state: "NV" },
    { slug: "irvine", name: "Irvine", state: "CA" },
    { slug: "durham", name: "Durham", state: "NC" },
    { slug: "madison", name: "Madison", state: "WI" },
    { slug: "boise", name: "Boise", state: "ID" },
    { slug: "phoenix", name: "Phoenix", state: "AZ" },
] as const

// Fast lookup sets
const KNOWN_SLUGS = new Set(SUPPORTED_CITIES.map(c => c.slug))
const KNOWN_NAMES_LOWER = new Map(SUPPORTED_CITIES.map(c => [c.name.toLowerCase(), c]))
const KNOWN_STATES = new Set(SUPPORTED_CITIES.map(c => c.state))

/**
 * Resolves an arbitrary string to a known directory city.
 * Returns null if the value does not match any known supported city.
 */
export function resolveKnownCity(input: unknown): DirectoryCity | null {
    if (typeof input !== 'string') return null
    const cleaned = input.trim().toLowerCase()
    if (!cleaned) return null

    // Exact slug match (e.g. "portland", "new-york")
    const bySlug = SUPPORTED_CITIES.find(c => c.slug === cleaned)
    if (bySlug) return bySlug

    // City name match (e.g. "Portland", "New York")
    if (KNOWN_NAMES_LOWER.has(cleaned)) {
        return KNOWN_NAMES_LOWER.get(cleaned)!
    }

    // Handles "City, ST" format (e.g. "Portland, OR")
    const parts = cleaned.split(',').map(p => p.trim())
    if (parts.length === 2 && KNOWN_NAMES_LOWER.has(parts[0])) {
        const cityObj = KNOWN_NAMES_LOWER.get(parts[0])!
        if (cityObj.state.toLowerCase() === parts[1]) {
            return cityObj
        }
    }

    return null
}

/**
 * Returns true only if the input corresponds to a recognized directory city.
 */
export function isKnownCity(input: unknown): boolean {
    return resolveKnownCity(input) !== null
}

/**
 * Returns true only if the input corresponds to a recognized directory state code (2 letters).
 */
export function isKnownState(input: unknown): boolean {
    if (typeof input !== 'string') return false
    return KNOWN_STATES.has(input.trim().toUpperCase())
}
