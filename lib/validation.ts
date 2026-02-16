/**
 * Input validation utilities for form data
 * Prevents common security issues (XSS, injection, etc.)
 */

export const validators = {
    /**
     * Validate email format
     */
    email: (value: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value) && value.length <= 254
    },

    /**
     * Validate phone number (US format, flexible)
     */
    phone: (value: string): boolean => {
        const cleaned = value.replace(/\D/g, '')
        return cleaned.length >= 10 && cleaned.length <= 11
    },

    /**
     * Validate name (letters, spaces, hyphens, apostrophes only)
     */
    name: (value: string): boolean => {
        const nameRegex = /^[a-zA-Z\s'-]{1,100}$/
        return nameRegex.test(value)
    },

    /**
     * Validate city name
     */
    city: (value: string): boolean => {
        const cityRegex = /^[a-zA-Z\s'-]{1,100}$/
        return cityRegex.test(value)
    },

    /**
     * Validate ZIP code (US)
     */
    zipCode: (value: string): boolean => {
        const zipRegex = /^\d{5}(-\d{4})?$/
        return zipRegex.test(value)
    },

    /**
     * Validate message/notes (no scripts, limited length)
     */
    message: (value: string): boolean => {
        // No script tags, limited to 1000 chars
        const hasScript = /<script|javascript:|onerror=/i.test(value)
        return !hasScript && value.length <= 1000
    },

    /**
     * Validate treatment selection (from allowed list)
     */
    treatment: (value: string): boolean => {
        const allowedTreatments = [
            'botox',
            'filler',
            'lip-filler',
            'masseter-botox',
            'dysport',
            'xeomin',
            'consultation'
        ]
        return allowedTreatments.includes(value.toLowerCase())
    },

    /**
     * Validate budget range (from allowed list)
     */
    budgetRange: (value: string): boolean => {
        const allowedRanges = [
            'under-300',
            '300-500',
            '500-800',
            '800-1200',
            'over-1200',
            'not-sure'
        ]
        return allowedRanges.includes(value)
    },

    /**
     * Validate timeframe (from allowed list)
     */
    timeframe: (value: string): boolean => {
        const allowedTimeframes = [
            'asap',
            'this-week',
            'this-month',
            'next-month',
            'just-researching'
        ]
        return allowedTimeframes.includes(value)
    }
}

/**
 * Sanitize string for safe display (prevent XSS)
 */
export function sanitizeString(value: string): string {
    return value
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim()
}

/**
 * Validate lead form data
 */
export interface LeadFormData {
    name: string
    email: string
    phone?: string
    city: string
    zipCode?: string
    treatment: string
    budgetRange?: string
    timeframe?: string
    message?: string
}

export interface ValidationResult {
    isValid: boolean
    errors: Record<string, string>
}

export function validateLeadForm(data: LeadFormData): ValidationResult {
    const errors: Record<string, string> = {}

    // Required fields
    if (!data.name || !validators.name(data.name)) {
        errors.name = 'Please enter a valid name (letters only, max 100 characters)'
    }

    if (!data.email || !validators.email(data.email)) {
        errors.email = 'Please enter a valid email address'
    }

    if (!data.city || !validators.city(data.city)) {
        errors.city = 'Please enter a valid city name'
    }

    if (!data.treatment || !validators.treatment(data.treatment)) {
        errors.treatment = 'Please select a valid treatment option'
    }

    // Optional fields
    if (data.phone && !validators.phone(data.phone)) {
        errors.phone = 'Please enter a valid phone number (10-11 digits)'
    }

    if (data.zipCode && !validators.zipCode(data.zipCode)) {
        errors.zipCode = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
    }

    if (data.budgetRange && !validators.budgetRange(data.budgetRange)) {
        errors.budgetRange = 'Please select a valid budget range'
    }

    if (data.timeframe && !validators.timeframe(data.timeframe)) {
        errors.timeframe = 'Please select a valid timeframe'
    }

    if (data.message && !validators.message(data.message)) {
        errors.message = 'Message contains invalid characters or is too long (max 1000 characters)'
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

/**
 * Rate limiting helper (simple in-memory)
 * For production, use Redis or similar
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 60000): boolean {
    const now = Date.now()
    const record = rateLimitMap.get(identifier)

    if (!record || now > record.resetAt) {
        rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs })
        return true
    }

    if (record.count >= maxRequests) {
        return false
    }

    record.count++
    return true
}

/**
 * Clean up old rate limit entries (call periodically)
 */
export function cleanupRateLimits() {
    const now = Date.now()
    for (const [key, record] of rateLimitMap.entries()) {
        if (now > record.resetAt) {
            rateLimitMap.delete(key)
        }
    }
}
