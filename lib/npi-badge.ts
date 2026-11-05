// Scoped NPI badge wording — John's decision, Nov 4, 2026.
//
// The old badge read "NPI Verified" whenever the provider flag OR any
// practitioner was verified, which implied the whole clinic was
// verified. That claim is never made now. The badge states exactly
// whose record matched:
//
// - One verified practitioner  -> "NPI record matched for {name}"
// - Several                  -> "NPI record matched for {n} listed practitioners"
// - Provider record only     -> "NPI record matched" (a registry match
//   for the listing's name, with the verification date when known)
//
// Dates: practitioner rows carry no verification timestamp — only an
// NPI enumeration date, which is when the NPI was assigned, NOT when
// we verified it, so it is never presented as a verification date.
// The provider-level npi_verified_at IS a verification timestamp, so
// it is shown only for the provider-record case, where it belongs.

export interface NpiPractitionerLike {
    name?: string | null
    is_npi_verified?: boolean | null
    npi_verified?: boolean | null
}

export interface NpiBadgeProviderLike {
    npi_verified?: boolean | null
    npi_verified_at?: string | Date | null
    practitioners?: NpiPractitionerLike[] | null
}

export interface NpiBadgeInfo {
    /** Short text for the pill/badge itself. */
    label: string
    /** Longer explanation of the scope, for a title attribute or detail line. */
    detail: string
}

function formatDate(value: string | Date): string | null {
    try {
        const d = value instanceof Date ? value : new Date(value)
        if (Number.isNaN(d.getTime())) return null
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
        return null
    }
}

export function npiBadgeFor(provider: NpiBadgeProviderLike | null | undefined): NpiBadgeInfo | null {
    if (!provider) return null

    const verifiedPractitioners = (provider.practitioners || []).filter(
        (p) => p && (p.is_npi_verified || p.npi_verified)
    )

    if (verifiedPractitioners.length === 1) {
        const p = verifiedPractitioners[0]
        const name = p.name?.trim()
        return {
            label: name ? `NPI record matched for ${name}` : 'NPI record matched for 1 listed practitioner',
            detail: name
                ? `NPI Registry record matched for ${name}. This confirms a registry record for this practitioner only — not the clinic and not every practitioner.`
                : 'NPI Registry record matched for one listed practitioner. This confirms a registry record for that practitioner only — not the clinic and not every practitioner.',
        }
    }

    if (verifiedPractitioners.length > 1) {
        const names = verifiedPractitioners
            .map((p) => p.name?.trim())
            .filter((n): n is string => Boolean(n))
        return {
            label: `NPI record matched for ${verifiedPractitioners.length} listed practitioners`,
            detail:
                names.length > 0
                    ? `NPI Registry records matched for ${names.join(', ')}. This confirms registry records for these practitioners only — not the clinic and not every practitioner.`
                    : 'NPI Registry records matched for these listed practitioners only — not the clinic and not every practitioner.',
        }
    }

    // No verified practitioner row, but the provider record itself
    // matched the registry (organization or name match). Name the
    // listing, not the clinic's practitioners, and show the real
    // verification date when we have it.
    if (provider.npi_verified) {
        const date = provider.npi_verified_at ? formatDate(provider.npi_verified_at) : null
        return {
            label: 'NPI record matched',
            detail: date
                ? `An NPI Registry record matched this listing's name on ${date}. This is a registry match for the listing — not verification of the clinic or every practitioner.`
                : 'An NPI Registry record matched this listing\'s name. This is a registry match for the listing — not verification of the clinic or every practitioner.',
        }
    }

    return null
}
