import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ONE-NIGHT batch route for NPI verification (owner-ordered 2026-10-24).
// Token-gated; remove this route after the batch run completes.
// It does NOT reuse lib/npi/verifyProvider: that helper marks a provider
// verified from the FIRST NPPES result filtered by state only, which is
// far too loose for a bulk run (common clinic names collide statewide).
// This route verifies STRICTLY and never marks an uncertain row verified:
//
//  - Provider already has an NPI number: look it up BY NUMBER. Verify only
//    if the registry record is active AND (org name matches after
//    normalization OR a practice address city+state matches the provider).
//  - Provider has no NPI: search by organization name + city + state.
//    Verify only if exactly one candidate survives with an exact
//    normalized org-name match AND a practice city+state match.
//  - Everything else -> decision "ambiguous" or "no_match": the row is left
//    unverified and listed in the response for human review.
//  - Rows already npi_verified=true are never touched.
//
// POST body: { token: string, limit?: number (max 25), cursor?: string (last id),
//              cities?: string[] (phase filter; omit for all remaining),
//              dryRun?: boolean }
// Response: { decisions: [...], nextCursor, done }

export const maxDuration = 60

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function normalizeName(s: string): string {
    return (s || '')
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, ' ')
        .replace(/\b(the|llc|inc|corp|corporation|pllc|pa|pc|md|do)\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function addressesOf(result: any): { city: string; state: string }[] {
    const out: { city: string; state: string }[] = []
    for (const a of result?.addresses || []) {
        out.push({ city: (a.city || '').toLowerCase(), state: (a.state || '').toUpperCase() })
    }
    return out
}

function addressMatches(result: any, city: string, state: string): boolean {
    const c = (city || '').toLowerCase()
    const s = (state || '').toUpperCase()
    return addressesOf(result).some((a) => a.city === c && a.state === s)
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

    const limit = Math.min(Math.max(parseInt(body.limit, 10) || 20, 1), 25)
    const cursor: string | null = body.cursor || null
    const cities: string[] | null = Array.isArray(body.cities) && body.cities.length ? body.cities : null
    const dryRun: boolean = body.dryRun === true

    let query = supabase
        .from('providers')
        .select('id,name,city,state,npi_number,npi_verified')
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
        await sleep(350) // polite pace against the public registry
        try {
            let verified: any = null
            let decision = 'no_match'

            if (p.npi_number && /^\d{10}$/.test(String(p.npi_number))) {
                const results = await nppes({ number: String(p.npi_number) })
                const r = results[0]
                if (r && (r.basic?.status || 'A') === 'A') {
                    const nameOk = normalizeName(r.basic?.organization_name || '') === normalizeName(p.name) && normalizeName(p.name) !== ''
                    const addrOk = addressMatches(r, p.city, p.state)
                    if (nameOk || addrOk) verified = r
                    else decision = 'ambiguous'
                }
            } else {
                const results = await nppes({
                    organization_name: p.name,
                    city: p.city,
                    state: p.state,
                })
                const survivors = results.filter((r: any) => {
                    if ((r.basic?.status || 'A') !== 'A') return false
                    if (normalizeName(r.basic?.organization_name || '') !== normalizeName(p.name)) return false
                    return addressMatches(r, p.city, p.state)
                })
                if (survivors.length === 1) verified = survivors[0]
                else if (survivors.length > 1) decision = 'ambiguous'
            }

            if (verified) {
                const primary = (verified.taxonomies || []).find((t: any) => t.primary) || verified.taxonomies?.[0]
                const update = {
                    npi_number: verified.number,
                    npi_verified: true,
                    npi_license_type: verified.basic?.credential || 'Organization',
                    npi_specialty: primary?.desc || null,
                    npi_verified_at: new Date().toISOString(),
                    npi_lookup_attempted: true,
                }
                if (!dryRun) {
                    const { error: upErr } = await supabase.from('providers').update(update).eq('id', p.id)
                    if (upErr) {
                        decisions.push({ id: p.id, name: p.name, city: p.city, decision: 'error', error: upErr.message })
                        continue
                    }
                }
                decisions.push({ id: p.id, name: p.name, city: p.city, decision: 'verified', npi: verified.number, dryRun })
            } else {
                if (!dryRun && decision !== 'error') {
                    await supabase.from('providers').update({ npi_lookup_attempted: true }).eq('id', p.id)
                }
                decisions.push({ id: p.id, name: p.name, city: p.city, decision, dryRun })
            }
        } catch (e: any) {
            decisions.push({ id: p.id, name: p.name, city: p.city, decision: 'error', error: String(e?.message || e) })
        }
    }

    const last = (providers || [])[(providers || []).length - 1]
    return NextResponse.json({
        decisions,
        nextCursor: last ? last.id : null,
        done: (providers || []).length < limit,
    })
}
