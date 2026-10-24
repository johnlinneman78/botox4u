import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Practitioner-first NPI verification batch (v2, owner-ordered 2026-10-24).
// Why v2 exists: the v1 org-level batch dry-ran 0/39 in Portland. Direct
// registry probes proved why — small med spas hold no organization (Type 2)
// NPI under their marketing names; they operate under their injectors'
// individual (Type 1) NPIs. So this route verifies PEOPLE, then flags the
// clinic: a provider counts as NPI-verified when ANY of its practitioners
// is verified (a clinic with a verified injector on staff is a verified
// profile; requiring the lead row specifically would wrongly exclude
// clinics whose lead is an RN with no NPI at all). Practitioner badges already render
// individually on profiles; the provider flag is what the homepage counts.
//
// Token-gated via NPI_BATCH_TOKEN; remove after the run. Strict rules:
//  - Practitioner already has an NPI: by-number lookup; verify only if the
//    record is active AND (first+last name match OR practice city+state match).
//  - Practitioner without an NPI: individual search by first+last name +
//    state; verify only if exactly one candidate survives with exact name
//    match AND a practice city+state match AND active status.
//  - National-unique fallback: a name with exactly one active registry
//    record nationwide verifies ONLY if that record's practice state is
//    the clinic's state or an adjacent state (border-metro cases like a
//    Portland injector registered in Vancouver, WA). A same-name record
//    3,000 miles away is more likely a different person than a commuter.
//  - A practitioner is only searched when BOTH first_name and last_name
//    columns are filled. First-name-only roster rows ("Nicole, Registered
//    Nurse") used to fall back to splitting full_name, which searched a
//    literal surname "Nurse" and matched real people named Nicole Nurse /
//    Monica Nurse / Natalie Nurse — three false verifications caught by
//    hand review in the San Diego dry-run. Such rows report 'no_name'.
//  - Rows previously rejected by hand review (npi_match_confidence =
//    'rejected_national_unique') are never re-searched, so a rollback
//    cannot resurrect itself on a re-run.
//  - Anything else -> ambiguous / no_match: row left unverified, listed
//    for review. Never pick first-of-many.
//  - Providers with no practitioner rows -> 'no_practitioners' (a data gap,
//    not a match failure).
//  - providers.npi_number is NEVER set from a practitioner's individual NPI
//    (org vs individual numbers must not be conflated); only the
//    providers.npi_verified flag + npi_verified_at are set.
//
// POST body: { token, limit?: providers per call (max 10), cursor?: last
//              provider id, cities?: string[], dryRun?: boolean }

export const maxDuration = 60

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const STATE_MAP: Record<string, string> = {
    oregon: 'OR', washington: 'WA', california: 'CA', 'new york': 'NY',
    texas: 'TX', florida: 'FL', arizona: 'AZ', nevada: 'NV', colorado: 'CO',
    illinois: 'IL', ohio: 'OH',
}

function norm(s: string): string {
    return (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
}

function stateCode(raw: string | null): string | null {
    const s = (raw || '').trim()
    if (/^[A-Za-z]{2}$/.test(s)) return s.toUpperCase()
    return STATE_MAP[s.toLowerCase()] || null
}

// Adjacent states, conservative: when unsure a pair is omitted, which only
// ever holds a verification (safe direction), never grants a false one.
const ADJACENT: Record<string, string[]> = {
    AL: ['FL', 'GA', 'MS', 'TN'], AK: [], AZ: ['CA', 'NV', 'UT', 'CO', 'NM'],
    AR: ['MO', 'TN', 'MS', 'LA', 'TX', 'OK'], CA: ['OR', 'NV', 'AZ'],
    CO: ['WY', 'NE', 'KS', 'OK', 'NM', 'UT'], CT: ['NY', 'MA', 'RI'],
    DE: ['MD', 'PA', 'NJ'], FL: ['GA', 'AL'], GA: ['FL', 'AL', 'TN', 'NC', 'SC'],
    HI: [], ID: ['WA', 'OR', 'NV', 'UT', 'WY', 'MT'], IL: ['WI', 'IN', 'KY', 'MO', 'IA'],
    IN: ['MI', 'OH', 'KY', 'IL'], IA: ['MN', 'WI', 'IL', 'MO', 'NE', 'SD'],
    KS: ['NE', 'MO', 'OK', 'CO'], KY: ['OH', 'IN', 'IL', 'MO', 'TN', 'VA', 'WV'],
    LA: ['TX', 'AR', 'MS'], ME: ['NH'], MD: ['VA', 'WV', 'PA', 'DE'],
    MA: ['RI', 'CT', 'NY', 'NH', 'VT'], MI: ['OH', 'IN', 'WI'],
    MN: ['WI', 'IA', 'SD', 'ND'], MS: ['LA', 'AR', 'TN', 'AL'],
    MO: ['IA', 'IL', 'KY', 'TN', 'AR', 'OK', 'KS', 'NE'], MT: ['ND', 'SD', 'WY', 'ID'],
    NE: ['SD', 'IA', 'MO', 'KS', 'CO', 'WY'], NV: ['OR', 'ID', 'UT', 'AZ', 'CA'],
    NH: ['ME', 'MA', 'VT'], NJ: ['NY', 'PA', 'DE'], NM: ['CO', 'OK', 'TX', 'AZ'],
    NY: ['VT', 'MA', 'CT', 'NJ', 'PA'], NC: ['VA', 'TN', 'GA', 'SC'],
    ND: ['MN', 'SD', 'MT'], OH: ['MI', 'IN', 'KY', 'WV', 'PA'],
    OK: ['KS', 'MO', 'AR', 'TX', 'NM', 'CO'], OR: ['WA', 'ID', 'NV', 'CA'],
    PA: ['NY', 'NJ', 'DE', 'MD', 'WV', 'OH'], RI: ['CT', 'MA'], SC: ['NC', 'GA'],
    SD: ['ND', 'MN', 'IA', 'NE', 'WY', 'MT'], TN: ['KY', 'VA', 'NC', 'GA', 'AL', 'MS', 'AR', 'MO'],
    TX: ['NM', 'OK', 'AR', 'LA'], UT: ['ID', 'WY', 'CO', 'AZ', 'NV'],
    VT: ['NY', 'NH', 'MA'], VA: ['MD', 'WV', 'KY', 'TN', 'NC'], WA: ['OR', 'ID'],
    WV: ['OH', 'PA', 'MD', 'VA', 'KY'], WI: ['MI', 'MN', 'IA', 'IL'],
    WY: ['MT', 'SD', 'NE', 'CO', 'UT', 'ID'], DC: ['MD', 'VA'],
}

function practiceState(result: any): string | null {
    const addrs = result?.addresses || []
    const loc = addrs.find((a: any) => a.address_purpose === 'LOCATION') || addrs[0]
    return loc?.state ? String(loc.state).toUpperCase() : null
}

function addressMatches(result: any, city: string, state: string | null): boolean {
    const c = (city || '').toLowerCase()
    return (result?.addresses || []).some((a: any) => {
        const cityOk = (a.city || '').toLowerCase() === c
        const stateOk = !state || (a.state || '').toUpperCase() === state
        return cityOk && stateOk
    })
}

function nameMatches(result: any, first: string, last: string): boolean {
    return norm(result?.basic?.first_name || '') === norm(first) &&
        norm(result?.basic?.last_name || '') === norm(last)
}

async function nppes(params: Record<string, string>): Promise<{ results: any[]; count: number }> {
    const q = new URLSearchParams({ version: '2.1', limit: '10', ...params })
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const res = await fetch(`https://npiregistry.cms.hhs.gov/api/?${q.toString()}`)
            if (res.status === 429 || res.status >= 500) {
                await sleep(2000 * (attempt + 1))
                continue
            }
            if (!res.ok) return { results: [], count: 0 }
            const data = await res.json()
            return { results: data.results || [], count: data.result_count || 0 }
        } catch {
            await sleep(2000 * (attempt + 1))
        }
    }
    return { results: [], count: 0 }
}

export async function POST(req: NextRequest) {
    let body: any = {}
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Bad JSON' }, { status: 400 })
    }

    const expected = process.env.NPI_BATCH_TOKEN || ''
    if (!expected || body.token !== expected) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''
    if (!url || !key) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }
    const supabase = createClient(url, key)

    const limit = Math.min(Math.max(parseInt(body.limit, 10) || 10, 1), 10)
    const cursor: string | null = body.cursor || null
    const cities: string[] | null = Array.isArray(body.cities) && body.cities.length ? body.cities : null
    const dryRun: boolean = body.dryRun === true

    let query = supabase
        .from('providers')
        .select('id,name,city,state,npi_verified')
        .neq('npi_verified', true)
        .order('id', { ascending: true })
        .limit(limit)
    if (cursor) query = query.gt('id', cursor)
    if (cities) query = query.in('city', cities)

    const { data: providers, error } = await query
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const decisions: any[] = []
    for (const p of providers || []) {
        const state = stateCode(p.state)
        const { data: pracs } = await supabase
            .from('provider_practitioners')
            .select('id,first_name,last_name,full_name,npi_number,npi_verified,npi_match_confidence')
            .eq('provider_id', p.id)
            .order('id', { ascending: true })

        if (!pracs || pracs.length === 0) {
            decisions.push({ provider_id: p.id, provider_name: p.name, city: p.city, decision: 'no_practitioners', dryRun })
            continue
        }

        let anyVerified = false
        for (let i = 0; i < pracs.length; i++) {
            const pr = pracs[i]
            if (pr.npi_verified) {
                anyVerified = true
                decisions.push({ provider_id: p.id, provider_name: p.name, practitioner: pr.full_name, decision: 'already_verified', dryRun })
                continue
            }
            if (pr.npi_match_confidence === 'rejected_national_unique') {
                decisions.push({ provider_id: p.id, provider_name: p.name, practitioner: pr.full_name, decision: 'previously_rejected', dryRun })
                continue
            }
            await sleep(350)
            try {
                const first = pr.first_name || ''
                const last = pr.last_name || ''
                let verified: any = null
                let decision = 'no_match'
                let path: string | null = null

                if (pr.npi_number && /^\d{10}$/.test(String(pr.npi_number))) {
                    const { results } = await nppes({ number: String(pr.npi_number) })
                    const r = results[0]
                    if (r && (r.basic?.status || 'A') === 'A') {
                        if ((first && last && nameMatches(r, first, last)) || addressMatches(r, p.city, state)) { verified = r; path = 'by_number' }
                        else decision = 'ambiguous'
                    }
                } else if (first && last) {
                    // Path A: name + state, then practice city/state match.
                    // Requires all results visible (count <= 10) so a single
                    // survivor is genuinely unique, not just page one.
                    const params: Record<string, string> = { first_name: first, last_name: last }
                    if (state) params.state = state
                    const { results, count } = await nppes(params)
                    const survivors = results.filter((r: any) => {
                        if ((r.basic?.status || 'A') !== 'A') return false
                        if (!nameMatches(r, first, last)) return false
                        return addressMatches(r, p.city, state)
                    })
                    if (survivors.length === 1 && count <= 10) { verified = survivors[0]; path = 'name_city_state' }
                    else if (survivors.length > 1 || count > 10) decision = 'ambiguous'
                    else {
                        // Path B: national unique, gated by proximity. A name
                        // with exactly one active registry record nationwide
                        // verifies ONLY if that record's practice state is
                        // the clinic's state or an adjacent state. This
                        // catches border-metro cases (e.g. a Portland
                        // injector registered in Vancouver, WA) while
                        // holding same-name records from far away, which
                        // are more likely different people. Ambiguous names
                        // never reach this path: count > 1 stays unmatched.
                        const nat = await nppes({ first_name: first, last_name: last })
                        if (nat.count === 1 && nat.results.length === 1 && (nat.results[0].basic?.status || 'A') === 'A' && nameMatches(nat.results[0], first, last)) {
                            const regState = practiceState(nat.results[0])
                            if (regState && state && (regState === state || (ADJACENT[state] || []).includes(regState))) {
                                verified = nat.results[0]; path = 'national_unique'
                            }
                        }
                    }
                } else {
                    decision = 'no_name'
                }

                if (verified) {
                    const primary = (verified.taxonomies || []).find((t: any) => t.primary) || verified.taxonomies?.[0]
                    const update = {
                        npi_number: verified.number,
                        npi_verified: true,
                        npi_enumeration_date: verified.basic?.enumeration_date || null,
                        npi_taxonomy_code: primary?.code || null,
                        npi_taxonomy_description: primary?.desc || null,
                        npi_match_confidence: 'high',
                        npi_lookup_attempted: true,
                        npi_last_updated: new Date().toISOString().slice(0, 10),
                    }
                    if (!dryRun) {
                        const { error: upErr } = await supabase.from('provider_practitioners').update(update).eq('id', pr.id)
                        if (upErr) {
                            decisions.push({ provider_id: p.id, provider_name: p.name, practitioner: pr.full_name, decision: 'error', error: upErr.message })
                            continue
                        }
                    }
                    anyVerified = true
                    decisions.push({ provider_id: p.id, provider_name: p.name, practitioner: pr.full_name, decision: 'verified', npi: verified.number, path, dryRun })
                } else {
                    if (!dryRun && decision !== 'no_name') {
                        await supabase.from('provider_practitioners').update({ npi_lookup_attempted: true }).eq('id', pr.id)
                    }
                    decisions.push({ provider_id: p.id, provider_name: p.name, practitioner: pr.full_name, decision, dryRun })
                }
            } catch (e: any) {
                decisions.push({ provider_id: p.id, provider_name: p.name, practitioner: pr.full_name, decision: 'error', error: String(e?.message || e) })
            }
        }

        if (anyVerified && !dryRun) {
            await supabase.from('providers').update({
                npi_verified: true,
                npi_verified_at: new Date().toISOString(),
            }).eq('id', p.id)
        }
        decisions.push({ provider_id: p.id, provider_name: p.name, city: p.city, decision: anyVerified ? 'provider_flag_set' : 'provider_flag_unset', dryRun })
    }

    const last = (providers || [])[(providers || []).length - 1]
    return NextResponse.json({
        decisions,
        nextCursor: last ? last.id : null,
        done: (providers || []).length < limit,
    })
}
