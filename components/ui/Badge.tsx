import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'sage' | 'gold' | 'outline' | 'premium' | 'secondary' | 'destructive'
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
    // Map legacy variants to new design system
    const resolved = (variant === 'premium' || variant === 'secondary') ? 'gold'
        : variant === 'destructive' ? 'outline'
            : variant

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-pill px-3 py-1 text-[11px] font-body font-medium',
                {
                    'bg-surface text-espresso': resolved === 'default',
                    'text-sage border border-sage/25': resolved === 'sage',
                    'text-gold border border-gold/25': resolved === 'gold',
                    'bg-transparent border border-border text-stone': resolved === 'outline',
                },
                className
            )}
            style={{
                ...(resolved === 'sage' ? { background: 'rgba(138, 158, 141, 0.1)' } : {}),
                ...(resolved === 'gold' ? { background: 'rgba(201, 169, 110, 0.1)' } : {}),
            }}
            {...props}
        >
            {children}
        </span>
    )
}
