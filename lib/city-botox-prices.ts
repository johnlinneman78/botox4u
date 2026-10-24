// Verified Botox per-unit price ranges, by city.
//
// A city joins this table ONLY when its range has been checked against
// prices clinics in that city actually publish. Never from an estimate,
// never from another city's range. The homepage hero reads this table:
// a visitor from a city with no verified range gets the fallback line,
// not a guessed number and not another city's price presented as their own.
export interface CityBotoxPrice {
    city: string
    range: string
    source: string
}

export const VERIFIED_CITY_BOTOX_PRICES: CityBotoxPrice[] = [
    {
        city: 'Portland',
        range: '$12–$17',
        source: 'Observed clinic published prices, Oct 2026 SEO research',
    },
]

export function findCityBotoxPrice(city: string | null | undefined): CityBotoxPrice | null {
    if (!city) return null
    const wanted = city.trim().toLowerCase()
    return VERIFIED_CITY_BOTOX_PRICES.find((p) => p.city.toLowerCase() === wanted) ?? null
}
