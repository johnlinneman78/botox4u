'use client'

import { cn } from '@/lib/utils'

interface FilterPillProps {
    label: string
    active?: boolean
    onToggle?: () => void
    variant?: 'default' | 'outcome'
}

export function FilterPill({ label, active = false, onToggle, variant = 'default' }: FilterPillProps) {
    const isOutcome = variant === 'outcome'

    return (
        <button
            onClick={onToggle}
            className={cn(
                'inline-flex items-center gap-1.5 rounded-pill px-4 py-2 text-sm font-body font-medium cursor-pointer transition-all',
            )}
            style={{
                transitionDuration: '200ms',
                transitionTimingFunction: 'var(--ease)',
                ...(active
                    ? {
                        background: isOutcome ? 'var(--color-sage)' : 'var(--color-espresso)',
                        color: 'var(--color-linen)',
                        border: `1px solid ${isOutcome ? 'var(--color-sage)' : 'var(--color-espresso)'}`,
                    }
                    : isOutcome
                        ? {
                            background: 'rgba(138, 158, 141, 0.1)',
                            color: 'var(--color-sage)',
                            border: '1px solid rgba(138, 158, 141, 0.25)',
                        }
                        : {
                            background: 'var(--color-surface)',
                            color: 'var(--color-espresso)',
                            border: '1px solid var(--color-border)',
                        }),
            }}
            onMouseEnter={(e) => {
                if (!active && !isOutcome) {
                    e.currentTarget.style.background = 'var(--color-blush)'
                }
            }}
            onMouseLeave={(e) => {
                if (!active && !isOutcome) {
                    e.currentTarget.style.background = 'var(--color-surface)'
                }
            }}
        >
            {isOutcome && !active && '✦ '}
            {label}
        </button>
    )
}
