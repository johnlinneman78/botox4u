/**
 * Shared U.S. Phone Normalization Rule:
 * Accepts:
 *   - Exactly 10 digits
 *   - Exactly 11 digits starting with '1' (normalized to 10 digits by stripping leading '1')
 * Rejects (returns null):
 *   - 11 digits not starting with '1'
 *   - Less than 10 digits
 *   - More than 11 digits
 *   - Non-string inputs or inputs with insufficient numeric characters
 */
export function normalizeUsPhone(input: unknown): string | null {
    if (typeof input !== 'string') return null
    const digitsOnly = input.replace(/\D/g, '')

    if (digitsOnly.length === 10) {
        return digitsOnly
    }

    if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
        return digitsOnly.slice(1)
    }

    return null
}

/** Formats a 10-digit normalized string as (XXX) XXX-XXXX for display */
export function formatUsPhone(digits: string): string {
    if (digits.length !== 10) return digits
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}
