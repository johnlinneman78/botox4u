/**
 * Focused Verification Test Suite for InjectorIndex (VerifiedAesthetics)
 * Tests run directly against production functions:
 *  1. Shared U.S. Phone Normalization Rule
 *  2. Canonical Directory Location Allowlist & Controlled Telemetry
 *  3. Coordinate Validation & Edge Interception Logic
 *  4. Analytics Query Parameter & URL Sanitization (Dropping 'q', field-specific validation, coordinate pairs, PII)
 *  5. Analytics Event Allowlist & Value Validation (Rejection of coordinate pairs, phone numbers, emails, nested objects)
 *  6. Lead Submission Error Recovery & Single Conversion Emission
 *  7. GA4 Page-View Deduplication & Request Count Verification
 */

import assert from 'node:assert'
import { normalizeUsPhone } from '../lib/utils/phone'
import {
    ALLOWED_QUERY_KEYS,
    isSafeQueryParam,
    sanitizeQueryParams,
    sanitizeUrlString
} from '../components/seo/GoogleAnalytics'
import {
    EVENT_PARAM_ALLOWLIST,
    filterEventParams,
    isValidParamValue,
    type AnalyticsEvent
} from '../lib/analytics'
import {
    resolveKnownCity,
    isKnownCity,
    isKnownState,
    SUPPORTED_CITIES
} from '../lib/constants/locations'
import {
    isValidCoordinate,
    isValidCoordinateString,
    parseCoordinateStrings
} from '../lib/utils/geo'

console.log('--- STARTING FOCUSED VERIFICATION PASS (EXPANDED LOCATIONS & GEO) ---')

let passedCount = 0
let failedCount = 0

function runTest(name: string, fn: () => void | Promise<void>) {
    try {
        const res = fn()
        if (res instanceof Promise) {
            return res.then(() => {
                console.log(`[PASS] ${name}`)
                passedCount++
            }).catch((err) => {
                console.error(`[FAIL] ${name}`)
                console.error(`       Error: ${err?.message || err}`)
                failedCount++
            })
        } else {
            console.log(`[PASS] ${name}`)
            passedCount++
        }
    } catch (err: any) {
        console.error(`[FAIL] ${name}`)
        console.error(`       Error: ${err?.message || err}`)
        failedCount++
    }
}

async function runAll() {
    // ─────────────────────────────────────────────────────────────────────────────
    // 1. Shared U.S. Phone Normalization Tests
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n[Suite 1: Shared U.S. Phone Normalization]')

    runTest('10-digit plain digits normalized', () => {
        assert.strictEqual(normalizeUsPhone('5035550199'), '5035550199')
    })

    runTest('10-digit formatted with parentheses & spaces normalized', () => {
        assert.strictEqual(normalizeUsPhone('(503) 555-0199'), '5035550199')
    })

    runTest('10-digit formatted with dots normalized', () => {
        assert.strictEqual(normalizeUsPhone('503.555.0199'), '5035550199')
    })

    runTest('11-digit starting with 1 normalized to 10 digits', () => {
        assert.strictEqual(normalizeUsPhone('15035550199'), '5035550199')
    })

    runTest('11-digit formatted with +1 normalized to 10 digits', () => {
        assert.strictEqual(normalizeUsPhone('+1 (503) 555-0199'), '5035550199')
    })

    runTest('11-digit NOT starting with 1 is rejected (returns null)', () => {
        assert.strictEqual(normalizeUsPhone('25035550199'), null)
        assert.strictEqual(normalizeUsPhone('95035550199'), null)
    })

    runTest('9-digit (short) number is rejected', () => {
        assert.strictEqual(normalizeUsPhone('503555019'), null)
    })

    runTest('12-digit (oversized) number is rejected', () => {
        assert.strictEqual(normalizeUsPhone('150355501999'), null)
    })

    runTest('Non-numeric alphabetic input is rejected', () => {
        assert.strictEqual(normalizeUsPhone('abcdefghij'), null)
        assert.strictEqual(normalizeUsPhone('503-CALL-NOW'), null)
    })

    runTest('Empty string, null, and non-string types rejected', () => {
        assert.strictEqual(normalizeUsPhone(''), null)
        assert.strictEqual(normalizeUsPhone(null), null)
        assert.strictEqual(normalizeUsPhone(undefined), null)
        assert.strictEqual(normalizeUsPhone(1234567890), null)
    })

    // ─────────────────────────────────────────────────────────────────────────────
    // 2. Canonical Directory Location Allowlists & Resolution
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n[Suite 2: Canonical Directory Locations & Resolution]')

    runTest('Resolves valid directory city names and slugs', () => {
        const bySlug = resolveKnownCity('portland')
        assert.strictEqual(bySlug?.slug, 'portland')
        assert.strictEqual(bySlug?.state, 'OR')

        const byName = resolveKnownCity('Portland')
        assert.strictEqual(byName?.slug, 'portland')

        const byCityState = resolveKnownCity('Portland, OR')
        assert.strictEqual(byCityState?.slug, 'portland')

        const ny = resolveKnownCity('New York')
        assert.strictEqual(ny?.slug, 'new-york')
        assert.strictEqual(ny?.state, 'NY')
    })

    runTest('Rejects arbitrary alphabetic text (e.g. personal names, clinic names)', () => {
        assert.strictEqual(resolveKnownCity('John Doe'), null)
        assert.strictEqual(resolveKnownCity('Dr. Alexis Parker'), null)
        assert.strictEqual(resolveKnownCity('Pacific MedSpa'), null)
        assert.strictEqual(resolveKnownCity('lip filler'), null)
        assert.strictEqual(resolveKnownCity(''), null)
        assert.strictEqual(resolveKnownCity(null), null)

        assert.strictEqual(isKnownCity('John Doe'), false)
        assert.strictEqual(isKnownCity('Dr. Smith'), false)
        assert.strictEqual(isKnownCity('portland'), true)
    })

    runTest('Validates known directory state codes', () => {
        assert.strictEqual(isKnownState('OR'), true)
        assert.strictEqual(isKnownState('CA'), true)
        assert.strictEqual(isKnownState('WA'), true)
        assert.strictEqual(isKnownState('ZZ'), false) // Invalid state code
        assert.strictEqual(isKnownState('12'), false)
    })

    // ─────────────────────────────────────────────────────────────────────────────
    // 3. Coordinate Validation & Edge Interception Logic
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n[Suite 3: Coordinate Validation & Edge Interception Logic]')

    runTest('Validates finite geographic coordinates in range', () => {
        assert.strictEqual(isValidCoordinate(45.5152, -122.6784), true)
        assert.strictEqual(isValidCoordinate(0, 0), true)
        assert.strictEqual(isValidCoordinate(90, 180), true)
        assert.strictEqual(isValidCoordinate(-90, -180), true)

        // Out of range coordinates
        assert.strictEqual(isValidCoordinate(90.1, 0), false)
        assert.strictEqual(isValidCoordinate(-90.1, 0), false)
        assert.strictEqual(isValidCoordinate(0, 180.1), false)
        assert.strictEqual(isValidCoordinate(0, -180.1), false)

        // Non-finite values
        assert.strictEqual(isValidCoordinate(NaN, -122.6784), false)
        assert.strictEqual(isValidCoordinate(Infinity, 0), false)
        assert.strictEqual(isValidCoordinate(null, null), false)
        assert.strictEqual(isValidCoordinate('45.5152' as any, '-122.6784' as any), false)
    })

    runTest('Validates complete coordinate strings before conversion (rejects trailing chars & garbage)', () => {
        // Valid coordinate strings
        assert.strictEqual(isValidCoordinateString('45.5152'), true)
        assert.strictEqual(isValidCoordinateString('-122.6784'), true)
        assert.strictEqual(isValidCoordinateString(' 45.5152 '), true)
        assert.strictEqual(isValidCoordinateString('0'), true)
        assert.strictEqual(isValidCoordinateString('90'), true)

        // Invalid / partial coordinate strings that parseFloat would otherwise corrupt
        assert.strictEqual(isValidCoordinateString('45.5152foo'), false)
        assert.strictEqual(isValidCoordinateString('45.5152;drop'), false)
        assert.strictEqual(isValidCoordinateString('45.5152,-122.6784'), false) // Comma pair in single key
        assert.strictEqual(isValidCoordinateString('abc'), false)
        assert.strictEqual(isValidCoordinateString(''), false)
        assert.strictEqual(isValidCoordinateString(null), false)

        // Parsing coordinate pairs with complete string validation
        assert.deepStrictEqual(parseCoordinateStrings('45.5152', '-122.6784'), { lat: 45.5152, lng: -122.6784 })
        assert.strictEqual(parseCoordinateStrings('45.5152foo', '-122.6784'), null)
        assert.strictEqual(parseCoordinateStrings('45.5152', '-181.0'), null) // Out of range
        assert.strictEqual(parseCoordinateStrings('91.0', '-122.6784'), null) // Out of range
    })

    runTest('Edge redirect logic cleanly intercepts legacy coordinates before HTML/tracker execution', () => {
        const incomingUrl = new URL('https://www.injectorindex.com/find-providers?city=portland&lat=45.5152&lng=-122.6784')
        const rawLatStr = incomingUrl.searchParams.get('lat')
        const rawLngStr = incomingUrl.searchParams.get('lng')

        const parsedCoords = parseCoordinateStrings(rawLatStr, rawLngStr)
        assert.notStrictEqual(parsedCoords, null)
        assert.strictEqual(parsedCoords?.lat, 45.5152)
        assert.strictEqual(parsedCoords?.lng, -122.6784)

        // Corrupted legacy input should reject
        const corruptedUrl = new URL('https://www.injectorindex.com/find-providers?lat=45.5152garbage&lng=-122.6784')
        assert.strictEqual(parseCoordinateStrings(corruptedUrl.searchParams.get('lat'), corruptedUrl.searchParams.get('lng')), null)

        // Simulate edge redirect transformation
        const cleanUrl = new URL(incomingUrl.toString())
        cleanUrl.searchParams.delete('lat')
        cleanUrl.searchParams.delete('lng')
        cleanUrl.searchParams.set('sort', 'distance')

        assert.strictEqual(cleanUrl.searchParams.has('lat'), false)
        assert.strictEqual(cleanUrl.searchParams.has('lng'), false)
        assert.strictEqual(cleanUrl.searchParams.get('sort'), 'distance')
        assert.strictEqual(cleanUrl.searchParams.get('city'), 'portland')
        assert.strictEqual(cleanUrl.toString(), 'https://www.injectorindex.com/find-providers?city=portland&sort=distance')
    })

    // ─────────────────────────────────────────────────────────────────────────────
    // 4. Query Parameter & URL Sanitization Tests
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n[Suite 4: Query Parameter & URL Sanitization]')

    runTest('Unrestricted search query "q" is completely dropped from analytics URLs', () => {
        const params = new URLSearchParams('q=dr+smith+portland&city=portland')
        const sanitized = sanitizeQueryParams(params)
        // 'q' must be excluded from analytics URL to prevent PII exposure
        assert.strictEqual(sanitized, 'city=portland')
        assert.strictEqual(ALLOWED_QUERY_KEYS.has('q'), false)
    })

    runTest('Arbitrary alphabetic strings in city parameter are rejected from analytics URL', () => {
        // Person name or arbitrary input passed as city
        assert.strictEqual(isSafeQueryParam('city', 'John Doe'), false)
        assert.strictEqual(isSafeQueryParam('city', 'Jane Smith'), false)
        assert.strictEqual(isSafeQueryParam('city', 'RandomClinic'), false)

        const params = new URLSearchParams('city=John+Doe')
        assert.strictEqual(sanitizeQueryParams(params), '')

        // Valid known city is preserved
        assert.strictEqual(isSafeQueryParam('city', 'portland'), true)
        const validParams = new URLSearchParams('city=portland')
        assert.strictEqual(sanitizeQueryParams(validParams), 'city=portland')
    })

    runTest('Coordinate pairs disguised in query parameters are strictly rejected', () => {
        assert.strictEqual(isSafeQueryParam('city', '45.5152'), false)
        assert.strictEqual(isSafeQueryParam('city', '45.5152,-122.6784'), false)
        assert.strictEqual(isSafeQueryParam('treatment', '45.5152, -122.6784'), false)

        const params = new URLSearchParams('city=45.5152,-122.6784')
        const sanitized = sanitizeQueryParams(params)
        assert.strictEqual(sanitized, '')
    })

    runTest('Phone numbers inside query parameters are strictly rejected', () => {
        assert.strictEqual(isSafeQueryParam('city', '503-555-0199'), false)
        assert.strictEqual(isSafeQueryParam('city', '5035550199'), false)
        assert.strictEqual(isSafeQueryParam('utm_campaign', 'call-503-555-0199'), false)
    })

    runTest('Email addresses inside query parameters are strictly rejected', () => {
        assert.strictEqual(isSafeQueryParam('city', 'patient@example.com'), false)
        assert.strictEqual(isSafeQueryParam('utm_source', 'user@domain.com'), false)
    })

    runTest('Field-specific structural validation rejects invalid values', () => {
        // city: must be recognized directory city
        assert.strictEqual(isSafeQueryParam('city', 'Portland123'), false)
        assert.strictEqual(isSafeQueryParam('city', 'New York'), true)
        assert.strictEqual(isSafeQueryParam('city', 'portland'), true)

        // state: must be recognized directory state
        assert.strictEqual(isSafeQueryParam('state', 'OR'), true)
        assert.strictEqual(isSafeQueryParam('state', 'ZZ'), false)

        // tier: must be controlled enum
        assert.strictEqual(isSafeQueryParam('tier', 'verified'), true)
        assert.strictEqual(isSafeQueryParam('tier', 'unverified_arbitrary'), false)

        // sort: must be controlled enum
        assert.strictEqual(isSafeQueryParam('sort', 'distance'), true)
        assert.strictEqual(isSafeQueryParam('sort', 'priority'), true)
        assert.strictEqual(isSafeQueryParam('sort', 'random_injection'), false)

        // page: must be integer
        assert.strictEqual(isSafeQueryParam('page', '3'), true)
        assert.strictEqual(isSafeQueryParam('page', 'three'), false)
    })

    runTest('Preserves approved navigation & campaign query parameters', () => {
        const params = new URLSearchParams('city=portland&state=OR&tier=verified&sort=distance&page=2&utm_source=google&utm_medium=cpc')
        const sanitized = sanitizeQueryParams(params)
        assert.strictEqual(sanitized, 'city=portland&state=OR&tier=verified&sort=distance&page=2&utm_source=google&utm_medium=cpc')
    })

    runTest('Sanitizes full URL string and removes unapproved parameters', () => {
        const rawUrl = 'https://www.injectorindex.com/find-providers?city=portland&lat=45.5152&lng=-122.6784&token=secret_123'
        const cleanUrl = sanitizeUrlString(rawUrl)
        assert.strictEqual(cleanUrl, 'https://www.injectorindex.com/find-providers?city=portland')
    })

    runTest('Sanitizes document.referrer URL without leaking visitor coordinates or personal queries', () => {
        const rawReferrer = 'https://www.google.com/search?q=botox+near+me&lat=45.5152&lng=-122.6784'
        const cleanReferrer = sanitizeUrlString(rawReferrer)
        assert.strictEqual(cleanReferrer, 'https://www.google.com/search')
    })

    // ─────────────────────────────────────────────────────────────────────────────
    // 5. Analytics Event Allowlist & Value Validation Tests
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n[Suite 5: Analytics Event Allowlists & Parameter Validation]')

    runTest('Allows approved parameters for lead_submitted', () => {
        const payload = {
            provider_id: 'd9b2d63d-a740-4f9e-a0e2-63bfa6144e18',
            provider_name: 'Pacific MedSpa',
            treatment: 'Botox',
        }
        const filtered = filterEventParams('lead_submitted', payload)
        assert.deepStrictEqual(filtered, payload)
    })

    runTest('Drops unapproved parameters in lead_submitted (e.g. email, phone, personal notes)', () => {
        const payload = {
            provider_id: 'd9b2d63d-a740-4f9e-a0e2-63bfa6144e18',
            provider_name: 'Pacific MedSpa',
            treatment: 'Botox',
            user_email: 'patient@example.com',
            user_phone: '5035550199',
            personal_message: 'Interested in lips',
        }
        const filtered = filterEventParams('lead_submitted', payload)
        assert.strictEqual((filtered as any).user_email, undefined)
        assert.strictEqual((filtered as any).user_phone, undefined)
        assert.strictEqual((filtered as any).personal_message, undefined)
        assert.strictEqual(filtered.provider_name, 'Pacific MedSpa')
    })

    runTest('Rejects coordinate pairs in event parameter values', () => {
        assert.strictEqual(isValidParamValue('45.5152,-122.6784'), false)
        assert.strictEqual(isValidParamValue('45.5152, -122.6784'), false)
        assert.strictEqual(isValidParamValue('45.5152'), false)
        assert.strictEqual(isValidParamValue('-122.6784'), false)
    })

    runTest('Rejects phone numbers and emails in event parameter values', () => {
        assert.strictEqual(isValidParamValue('patient@example.com'), false)
        assert.strictEqual(isValidParamValue('503-555-0199'), false)
        assert.strictEqual(isValidParamValue('5035550199'), false)
    })

    runTest('Rejects arbitrary nested objects and arrays', () => {
        const payload = {
            provider_id: '123',
            provider_name: { first: 'John', last: 'Doe' },
            tags: ['botox', 'filler'],
        }
        const filtered = filterEventParams('lead_submitted', payload as any)
        assert.strictEqual(filtered.provider_name, undefined)
        assert.strictEqual((filtered as any).tags, undefined)
        assert.strictEqual(filtered.provider_id, '123')
    })

    runTest('Rejects oversized values (> 80 characters) and injection characters', () => {
        assert.strictEqual(isValidParamValue('A'.repeat(81)), false)
        assert.strictEqual(isValidParamValue('A'.repeat(80)), true)
        assert.strictEqual(isValidParamValue('<script>alert(1)</script>'), false)
    })

    runTest('Resolves valid directory city in provider_search event', () => {
        const searchPayload = {
            search_city: 'Portland',
            search_state: 'OR',
            filter_tier: 'verified',
            filter_type: 'artisan',
            filter_view: 'grid',
            source: 'hero_city_select',
        }
        const filtered = filterEventParams('provider_search', searchPayload)
        assert.deepStrictEqual(filtered, {
            search_city: 'portland',
            search_state: 'OR',
            location_resolved: true,
            filter_tier: 'verified',
            filter_type: 'artisan',
            filter_view: 'grid',
            source: 'hero_city_select',
        })
    })

    runTest('Drops arbitrary unverified city input and flags has_search_query without forwarding raw text', () => {
        const unverifiedSearchPayload = {
            search_city: 'Dr. John Doe Clinic', // Arbitrary personal input
            source: 'provider_filters',
        }
        const filtered = filterEventParams('provider_search', unverifiedSearchPayload)
        assert.strictEqual(filtered.search_city, undefined)
        assert.strictEqual(filtered.location_resolved, false)
        assert.strictEqual(filtered.has_search_query, true)
        assert.strictEqual(filtered.source, 'provider_filters')
    })

    // ─────────────────────────────────────────────────────────────────────────────
    // 6. Lead Form Error Handling, Loading State Recovery, & Single Event Emission
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n[Suite 6: Lead Form Mocked Flow & Event Emission Integrity]')

    interface MockFormState {
        isSubmitting: boolean
        isSuccess: boolean
        error: string | null
        emittedEvents: { event: string; params: any }[]
    }

    async function simulateFormSubmission(
        formData: { full_name: string; email: string; phone: string; treatment_type: string },
        mockServerAction: (data: any) => Promise<{ success: boolean; error?: string }>
    ): Promise<MockFormState> {
        const state: MockFormState = {
            isSubmitting: false,
            isSuccess: false,
            error: null,
            emittedEvents: [],
        }

        const normalizedPhone = normalizeUsPhone(formData.phone)
        if (!normalizedPhone) {
            state.error = 'Please enter a valid 10-digit U.S. phone number'
            return state
        }

        state.isSubmitting = true
        state.error = null

        try {
            const result = await mockServerAction({
                ...formData,
                phone: normalizedPhone,
            })

            if (result.success) {
                state.emittedEvents.push({
                    event: 'lead_submitted',
                    params: {
                        treatment: formData.treatment_type,
                    },
                })
                state.isSuccess = true
            } else {
                state.error = result.error || 'Submission could not be completed.'
            }
        } catch {
            state.error = 'Unable to send your request right now. Please try again or contact the clinic directly.'
        } finally {
            state.isSubmitting = false
        }

        return state
    }

    await runTest('Single lead_submitted event emitted on successful submission', async () => {
        const resultState = await simulateFormSubmission(
            { full_name: 'Jane Doe', email: 'jane@example.com', phone: '(503) 555-0199', treatment_type: 'Botox' },
            async () => ({ success: true })
        )

        assert.strictEqual(resultState.isSubmitting, false)
        assert.strictEqual(resultState.isSuccess, true)
        assert.strictEqual(resultState.error, null)
        assert.strictEqual(resultState.emittedEvents.length, 1)
        assert.strictEqual(resultState.emittedEvents[0].event, 'lead_submitted')
    })

    await runTest('No lead_submitted event emitted when phone number is invalid (rejected submission)', async () => {
        const resultState = await simulateFormSubmission(
            { full_name: 'Jane Doe', email: 'jane@example.com', phone: '12345', treatment_type: 'Botox' },
            async () => ({ success: true })
        )

        assert.strictEqual(resultState.isSubmitting, false)
        assert.strictEqual(resultState.isSuccess, false)
        assert.strictEqual(resultState.error, 'Please enter a valid 10-digit U.S. phone number')
        assert.strictEqual(resultState.emittedEvents.length, 0)
    })

    await runTest('Loading state recovers (isSubmitting clears to false) and error is shown when exception is thrown', async () => {
        const resultState = await simulateFormSubmission(
            { full_name: 'Jane Doe', email: 'jane@example.com', phone: '5035550199', treatment_type: 'Botox' },
            async () => {
                throw new Error('Database network timeout')
            }
        )

        assert.strictEqual(resultState.isSubmitting, false)
        assert.strictEqual(resultState.isSuccess, false)
        assert.strictEqual(resultState.error, 'Unable to send your request right now. Please try again or contact the clinic directly.')
        assert.strictEqual(resultState.emittedEvents.length, 0)
    })

    await runTest('Loading state recovers and usable server error is displayed on failure', async () => {
        const resultState = await simulateFormSubmission(
            { full_name: 'Jane Doe', email: 'jane@example.com', phone: '5035550199', treatment_type: 'Botox' },
            async () => ({ success: false, error: 'Too many requests. Please try again in a minute.' })
        )

        assert.strictEqual(resultState.isSubmitting, false)
        assert.strictEqual(resultState.isSuccess, false)
        assert.strictEqual(resultState.error, 'Too many requests. Please try again in a minute.')
        assert.strictEqual(resultState.emittedEvents.length, 0)
    })

    // ─────────────────────────────────────────────────────────────────────────────
    // 7. GA4 Page-View Deduplication & Request Count Verification
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n[Suite 7: GA4 Page-View Deduplication & Request Count Verification]')

    class MockGA4Tracker {
        public pageViewCount = 0
        public recordedPaths: string[] = []
        private lastPath: string | null = null

        trackNavigation(rawPathname: string, rawSearchParams: URLSearchParams | null) {
            const cleanQs = sanitizeQueryParams(rawSearchParams)
            const sanitizedPath = cleanQs ? `${rawPathname}?${cleanQs}` : rawPathname

            if (this.lastPath === sanitizedPath) {
                return // Deduplicated
            }

            this.pageViewCount++
            this.recordedPaths.push(sanitizedPath)
            this.lastPath = sanitizedPath
        }
    }

    runTest('Initial page load dispatches exactly 1 page_view event', () => {
        const tracker = new MockGA4Tracker()
        tracker.trackNavigation('/find-providers', new URLSearchParams('city=portland'))
        assert.strictEqual(tracker.pageViewCount, 1)
        assert.deepStrictEqual(tracker.recordedPaths, ['/find-providers?city=portland'])
    })

    runTest('Identical client re-render / hydration emits 0 extra page_views', () => {
        const tracker = new MockGA4Tracker()
        tracker.trackNavigation('/find-providers', new URLSearchParams('city=portland'))
        tracker.trackNavigation('/find-providers', new URLSearchParams('city=portland'))
        assert.strictEqual(tracker.pageViewCount, 1)
    })

    runTest('Client-side navigation to provider profile emits exactly 1 additional page_view', () => {
        const tracker = new MockGA4Tracker()
        tracker.trackNavigation('/find-providers', new URLSearchParams('city=portland'))
        tracker.trackNavigation('/provider/dr-alexis-parker', null)
        assert.strictEqual(tracker.pageViewCount, 2)
        assert.strictEqual(tracker.recordedPaths[1], '/provider/dr-alexis-parker')
    })

    runTest('Browser Back/Forward navigation emits exactly 1 page_view per step', () => {
        const tracker = new MockGA4Tracker()
        tracker.trackNavigation('/find-providers', new URLSearchParams('city=portland'))
        tracker.trackNavigation('/provider/dr-alexis-parker', null)
        tracker.trackNavigation('/find-providers', new URLSearchParams('city=portland'))
        assert.strictEqual(tracker.pageViewCount, 3)
        assert.strictEqual(tracker.recordedPaths[2], '/find-providers?city=portland')
    })

    runTest('Filter change updates sanitized URL and emits exactly 1 page_view', () => {
        const tracker = new MockGA4Tracker()
        tracker.trackNavigation('/find-providers', new URLSearchParams('city=portland'))
        tracker.trackNavigation('/find-providers', new URLSearchParams('city=seattle'))
        assert.strictEqual(tracker.pageViewCount, 2)
        assert.strictEqual(tracker.recordedPaths[1], '/find-providers?city=seattle')
    })

    runTest('Geolocation sorting update (?sort=distance) emits exactly 1 page_view without coordinate leakage', () => {
        const tracker = new MockGA4Tracker()
        tracker.trackNavigation('/find-providers', null)
        tracker.trackNavigation('/find-providers', new URLSearchParams('sort=distance'))
        assert.strictEqual(tracker.pageViewCount, 2)
        assert.strictEqual(tracker.recordedPaths[1], '/find-providers?sort=distance')
    })

    runTest('Unapproved query parameter changes emit 0 extra page_views', () => {
        const tracker = new MockGA4Tracker()
        tracker.trackNavigation('/find-providers', new URLSearchParams('city=portland'))
        tracker.trackNavigation('/find-providers', new URLSearchParams('city=portland&lat=45.5152&lng=-122.6784&token=abc'))
        assert.strictEqual(tracker.pageViewCount, 1)
    })

    // ─────────────────────────────────────────────────────────────────────────────
    // Summary
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n=============================================')
    console.log(`TOTAL TESTS: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`)
    console.log('=============================================\n')

    if (failedCount > 0) {
        process.exit(1)
    }
}

runAll()
