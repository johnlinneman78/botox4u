import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Practitioner-first NPI verification batch (v2, owner-ordered 2026-10-24).
// Why v2 exists: the v1 org-level batch dry-ran 0/39 in Portland. Direct
// registry probes proved why — small med spas hold no organization (Type 2)
// NPI under their marketing names; they operate under their injectors'
// individual (Type 1) NPIs. So this route verifies PEOPLE, then flags the
// clinic: a provider counts as NPI-verified when its LEAD practitioner
// (first practitioner row) is verified. Practitioner badges already render
// individually on profiles; the provider flag is what the homepage counts.
//
// Token-gated via NPI_BATCH_TOKEN; remove after the run. Strict rules:
//  - Practitioner already has an NPI: by-number lookup; verify only if the
//    record is active AND (first+last name match OR practice city+state match).
//  - Practitioner without an NPI: individual search by first+last name +
//    state; verify only if exactly one candidate survives with exact name
//    match AND a practice city+state match AND active status.
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

async function nppes(params: Record<string, string>): Promise<any[]> {
    const q = new URLSearchParams({ version: '2.1', limit: '10', ...params })
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const res = await fetch(`https://npiregistry.cms.hhs.gov/api/?${q.toString()}`)
            if (res.status === 429 || res.status >= 500) {
                await sleep(2000 * (attempt + 1))
                continue
            }
            if (!res.ok) return []
            const data = await res.json()
            return data.results || []
        } catch {
            await sleep(2000 * (attempt + 1))
        }
    }
    return []
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
            .select('id,first_name,last_name,full_name,npi_number,npi_verified')
            .eq('provider_id', p.id)
            .order('id', { ascending: true })

        if (!pracs || pracs.length === 0) {
            decisions.push({ provider_id: p.id, provider_name: p.name, city: p.city, decision: 'no_practitioners', dryRun })
            continue
        }

        let leadVerified = false
        for (let i = 0; i < pracs.length; i++) {
            const pr = pracs[i]
            if (pr.npi_verified) {
                if (i === 0) leadVerified = true
                decisions.push({ provider_id: p.id, provider_name: p.name, practitioner: pr.full_name, decision: 'already_verified', dryRun })
                continue
            }
            await sleep(350)
            try {
                const first = pr.first_name || (pr.full_name || '').split(' ')[0] || ''
                const last = pr.last_name || (pr.full_name || '').split(' ').slice(-1)[0] || ''
                let verified: any = null
                let decision = 'no_match'

                if (pr.npi_number && /^\d{10}$/.test(String(pr.npi_number))) {
                    const results = await nppes({ number: String(pr.npi_number) })
                    const r = results[0]
                    if (r && (r.basic?.status || 'A') === 'A') {
                        if (nameMatches(r, first, last) || addressMatches(r, p.city, state)) verified = r
                        else decision = 'ambiguous'
                    }
                } else if (first && last) {
                    const params: Record<string, string> = { first_name: first, last_name: last }
                    if (state) params.state = state
                    const results = await nppes(params)
                    const survivors = results.filter((r: any) => {
                        if ((r.basic?.status || 'A') !== 'A') return false
                        if (!nameMatches(r, first, last)) return false
                        return addressMatches(r, p.city, state)
                    })
                    if (survivors.length === 1) verified = survivors[0]
                    else if (survivors.length > 1) decision = 'ambiguous'
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
                    if (i === 0) leadVerified = true
                    decisions.push({ provider_id: p.id, provider_name: p.name, practitioner: pr.full_name, decision: 'verified', npi: verified.number, dryRun })
                } else {
                    if (!dryRun) {
                        await supabase.from('provider_practitioners').update({ npi_lookup_attempted: true }).eq('id', pr.id)
                    }
                    decisions.push({ provider_id: p.id, provider_name: p.name, practitioner: pr.full_name, decision, dryRun })
                }
            } catch (e: any) {
                decisions.push({ provider_id: p.id, provider_name: p.name, practitioner: pr.full_name, decision: 'error', error: String(e?.message || e) })
            }
        }

        if (leadVerified && !dryRun) {
            await supabase.from('providers').update({
                npi_verified: true,
                npi_verified_at: new Date().toISOString(),
            }).eq('id', p.id)
        }
        decisions.push({ provider_id: p.id, provider_name: p.name, city: p.city, decision: leadVerified ? 'provider_flag_set' : 'provider_flag_unset', dryRun })
    }

    const last = (providers || [])[(providers || []).length - 1]
    return NextResponse.json({
        decisions,
        nextCursor: last ? last.id : null,
        done: (providers || []).length < limit,
    })
}
