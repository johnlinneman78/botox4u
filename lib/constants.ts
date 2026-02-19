export const STATE_MAP: Record<string, string> = {
    'alabama': 'AL',
    'alaska': 'AK',
    'arizona': 'AZ',
    'arkansas': 'AR',
    'california': 'CA',
    'colorado': 'CO',
    'connecticut': 'CT',
    'delaware': 'DE',
    'florida': 'FL',
    'georgia': 'GA',
    'hawaii': 'HI',
    'idaho': 'ID',
    'illinois': 'IL',
    'indiana': 'IN',
    'iowa': 'IA',
    'kansas': 'KS',
    'kentucky': 'KY',
    'louisiana': 'LA',
    'maine': 'ME',
    'maryland': 'MD',
    'massachusetts': 'MA',
    'michigan': 'MI',
    'minnesota': 'MN',
    'mississippi': 'MS',
    'missouri': 'MO',
    'montana': 'MT',
    'nebraska': 'NE',
    'nevada': 'NV',
    'new-hampshire': 'NH',
    'new-jersey': 'NJ',
    'new-mexico': 'NM',
    'new-york': 'NY',
    'north-carolina': 'NC',
    'north-dakota': 'ND',
    'ohio': 'OH',
    'oklahoma': 'OK',
    'oregon': 'OR',
    'pennsylvania': 'PA',
    'rhode-island': 'RI',
    'south-carolina': 'SC',
    'south-dakota': 'SD',
    'tennessee': 'TN',
    'texas': 'TX',
    'utah': 'UT',
    'vermont': 'VT',
    'virginia': 'VA',
    'washington': 'WA',
    'west-virginia': 'WV',
    'wisconsin': 'WI',
    'wyoming': 'WY',
}

export const REVERSE_STATE_MAP = Object.fromEntries(
    Object.entries(STATE_MAP).map(([name, code]) => [code, name])
)

export function getStateName(code: string): string {
    const slug = REVERSE_STATE_MAP[code.toUpperCase()]
    if (!slug) return code
    return slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
}

import { NICHE } from '@/config/niche'

export const TREATMENTS = NICHE.calculator.variables.map(v => ({
    slug: v.id,
    name: v.label,
    description: `Professional ${v.label} treatment solutions.`
}))
