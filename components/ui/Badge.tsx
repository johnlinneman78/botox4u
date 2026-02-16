import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'featured' | 'premium' | 'verified'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                {
                    'bg-gray-100 text-gray-800': variant === 'default',
                    'bg-accent/20 text-accent border border-accent': variant === 'featured',
                    'bg-secondary/20 text-secondary border border-secondary': variant === 'premium',
                    'bg-success/20 text-success border border-success': variant === 'verified',
                },
                className
            )}
            {...props}
        />
    )
}
